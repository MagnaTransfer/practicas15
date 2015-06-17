/**  
 *   placeForMe -
 *   Copyright (C) 2015 by Magna SIS <magnasis@magnasis.com>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// models/student_course.js

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Student_Course', {
        student_id: {
            type: DataTypes.INTEGER,
            unique: 'item_tag_taggable'
        },
        student_priority: {
            type: DataTypes.INTEGER,
        },
        course_position: {
            type: DataTypes.INTEGER,
        },
        course_id: {
            type: DataTypes.INTEGER,
            unique: 'item_tag_taggable',
            references: null
        }
    });
}