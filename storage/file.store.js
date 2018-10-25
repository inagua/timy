const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const moment = require('moment');

const Store = require('./store');

const Encoding = 'utf8';

function backupJson(jsonPath) {
    const yesterday = moment().add(-1, 'days').format('YYMMDD');
    const fileExtension = path.extname(jsonPath);
    const backupPath = jsonPath.replace(fileExtension, '-' + yesterday + fileExtension);
    if (!fs.existsSync(backupPath)) {
        fsExtra.copySync(jsonPath, backupPath);
        return true;
    }
    return false;
}

module.exports = class FileStore extends Store {

    constructor(path) {
        super(path);
    }

    loadJson() {
        try {
            const content = fs.readFileSync(this.key, Encoding);
            backupJson(this.key);
            return JSON.parse(content);
        } catch (e) {
            console.error(' /!\\ Json file not found at:', e.path);
        }
        return undefined;
    }

    saveJson(json) {
        fs.writeFileSync(this.key, JSON.stringify(json), Encoding);
    }

};
