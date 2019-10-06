const { saltHashPassword } = require('./api/handlers');

const admin = [
    { id: '9572641152', username: 'admin_1', passwordData: saltHashPassword('admin_1'), firstName: 'Bat', lastName: 'Mann', role: 'user_1', language: 'en' },
    { id: '9210267541', username: 'admin_2', passwordData: saltHashPassword('admin_2'), firstName: 'Robin', lastName: 'Trashcans', role: 'user_2', language: 'fr' }
];

const dataLayer = {};
const userLayer = [];

module.exports = {
    dataLayer,
    userLayer,
    admin
}