const Activated = true;
const Modified = true;

module.exports = class Command {

    constructor(options, aliases, value, type, comments) {
        this.options = options;
        this.aliases = aliases || [];
        this.value = value;
        this.type = type;
        this.comments = comments || [];
    }

    isActivated(minimist) {
        for (let o of this.options.concat(this.aliases)) {
            if (minimist[o]) {
                return true;
            }
        }
        return false;
    }

    /*
    {
      string: 'lang',           // --lang xml
      boolean: ['version'],     // --version
      alias: { v: 'version' }
    }
     */
    cli(minimistOptions, usage) {
        this.options.forEach(o => {
            if (this.type === 'string' || this.type === 'boolean') {
                minimistOptions[this.type] = minimistOptions[this.type] || [];
                minimistOptions[this.type].push(o)
            }
        });

        const first = this.options[0];
        minimistOptions.alias = minimistOptions.alias || {};
        this.aliases.forEach(a => minimistOptions.alias[a] = first);

        usage.command = usage.command || '';
        usage.command += '--' + this.options.join('|');
        if (this.aliases && this.aliases.length > 0) {
            usage.command += '|' + this.aliases.join('|');
        }
        usage.command += ' ' + this.value;

        usage.comments = usage.comments || [];
        usage.comments = usage.comments.concat(this.comments);
    }

    handle(json, parameters, now) {}

    status(activated, changed, json) {
        return {activated, changed, json};
    }

    error(activated, error) {
        return {activated, error};
    }

    stopCurrent(json, now) {
        const previous = json.current;
        if (previous && previous.project) {
            previous.stop = now;
            json.tracks = json.tracks || [];
            json.tracks.push(previous);
            json.current = {};
            // hasChanged = true;
        }
    }

    static get Activated() {
        return Activated;
    }

    static get Modified() {
        return Modified;
    }

};