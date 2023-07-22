import {
    Sequelize,
    Model,
    DataTypes,
    ForeignKey,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

export const sequelize = new Sequelize("sqlite::memory");

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare createdAt: Date;
    declare hash: string | null;
    declare salt: string | null;
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

export class Book extends Model<
    InferAttributes<Book>,
    InferCreationAttributes<Book>
> {
    declare id: CreationOptional<number>;
    declare name: string;
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
    declare book_id: ForeignKey<Book["id"]> | null;
    declare section_id: ForeignKey<Section["id"]> | null;
    declare name: string | null;
    declare exercise: number | null;
    declare filepath: string | null;
}
Exercise.init(
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
    declare done_at: Date;
    declare tempo: number;
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
            allowNull: false,
        },
        done_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        tempo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { sequelize, modelName: "Practice" }
);
