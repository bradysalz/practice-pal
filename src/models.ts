import {
    Sequelize,
    Model,
    DataTypes,
    ForeignKey,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
});

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare createdAt: Date;
    declare hash: string | null;
    declare salt: string | null;
    static associate() {
        User.hasMany(Practice, { foreignKey: "user_id" });
    }
}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        hash: { type: DataTypes.TEXT },
        salt: { type: DataTypes.TEXT },
    },
    {
        sequelize,
        modelName: "User",
    }
);

export class Artist extends Model<
    InferAttributes<Artist>,
    InferCreationAttributes<Artist>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    static associate() {
        Artist.hasMany(Song, { foreignKey: "artist_id" });
    }
}
Artist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Artist",
    }
);

export class Song extends Model<
    InferAttributes<Song>,
    InferCreationAttributes<Song>
> {
    declare id: CreationOptional<number>;
    declare artist_id: ForeignKey<Artist["id"]> | null;
    declare name: string;
    static associate() {
        Song.belongsTo(Artist, { foreignKey: "artist_id" });
        Song.hasMany(Practice, { foreignKey: "song_id" });
    }
}
Song.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        artist_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Song",
    }
);

export class Book extends Model<
    InferAttributes<Book>,
    InferCreationAttributes<Book>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    static associate() {
        Book.hasMany(Section, { foreignKey: "book_id" });
    }
}
Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Book",
    }
);

export class Section extends Model<
    InferAttributes<Section>,
    InferCreationAttributes<Section>
> {
    declare id: CreationOptional<number>;
    declare book_id: ForeignKey<Book["id"]> | null;
    declare section: string;
    static associate() {
        Section.belongsTo(Book, { foreignKey: "book_id" });
        Section.hasMany(Exercise, { foreignKey: "section_id" });
    }
}
Section.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Section",
    }
);

export class Exercise extends Model<
    InferAttributes<Exercise>,
    InferCreationAttributes<Exercise>
> {
    declare id: CreationOptional<number>;
    declare section_id: ForeignKey<Section["id"]> | null;
    declare name: string | null;
    declare exercise: number | null;
    declare filepath: string | null;
    static associate() {
        Exercise.belongsTo(Section, { foreignKey: "section_id" });
        Exercise.hasMany(Practice, { foreignKey: "exercise_id" });
    }
}
Exercise.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        section_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        exercise: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        filepath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    { sequelize, modelName: "Exercise" }
);

export class Practice extends Model<
    InferAttributes<Practice>,
    InferCreationAttributes<Practice>
> {
    declare id: CreationOptional<number>;
    declare user_id: ForeignKey<User["id"]>;
    declare exercise_id: ForeignKey<Exercise["id"]>;
    declare song_id: ForeignKey<Song["id"]>;
    declare done_at: Date;
    declare tempo: number;
    declare note: string;
    static associate() {
        Practice.belongsTo(User, { foreignKey: "user_id" });
        Practice.belongsTo(Exercise, { foreignKey: "exercise_id" });
        Practice.belongsTo(Song, { foreignKey: "song_id" });
    }
}

Practice.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        song_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        done_at: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        tempo: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    { sequelize, modelName: "Practice" }
);

/**
 * Initialize all model associations and sync the database
 */
export function initializeAllModels() {
    User.associate();
    Artist.associate();
    Song.associate();
    Book.associate();
    Section.associate();
    Exercise.associate();
    Practice.associate();
    sequelize.sync();
}
