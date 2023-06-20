import { Sequelize, DataTypes } from 'sequelize';

export const database = new Sequelize('sqlite::memory');


export const Section = database.define('Section', {
    section: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export const User = database.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hash: DataTypes.TEXT,
    salt: DataTypes.TEXT,
});

export const Exercise = database.define('Exercise', {
    section_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    exercise: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export const Practice = database.define('Practice', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    section_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    done_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tempo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
})
