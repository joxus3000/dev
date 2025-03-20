const db = require("../config/db");

exports.createDoctor = async (fullName, username, password, doctorid, specialty, phone) => {
    const [result] = await db.query(
        "INSERT INTO doctor (fullName, username, password, doctorid, specialty, phone) VALUES (?, ?, ?, ?, ?, ?)",
        [fullName, username, password, doctorid, specialty, phone]
    );
    return result.insertId;
    }

exports.findDoctorByUsername = async (username) => {
    const [users] = await db.query("SELECT * FROM doctor WHERE username = ?", [username]);
    return users.length ? users[0] : null;
}

exports.getAllDoctors = async () => {
    const [users] = await db.query("SELECT doctorid, fullName, username, specialty, phone FROM doctor");
    return users;
};

exports.updatePassword = async (username, password) => {
    const [result] = await db.query(
        "UPDATE doctor SET password = ? WHERE username = ?",
        [password, username]
    );
    return result.affectedRows;
};

exports.deleteDoctor = async (doctorid) => {
    const [result] = await db.query("DELETE FROM doctor WHERE doctorid = ?", [doctorid]);
    return result.affectedRows;
};