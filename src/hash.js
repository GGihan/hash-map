export class HashMap {
    constructor(initialCapacity = 16, loadFactor = 0.75) {
        this.buckets = new Array(initialCapacity).fill(null).map(() => []);
        this.capacity = initialCapacity;
        this.loadFactor = loadFactor;
        this.size = 0;
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
        }

        return hashCode;
    }

    _getBucket(key) {
        const index = this.hash(key);

        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bounds");
        }
        return this.buckets[index];
    }

    set(key, value) {
        const bucket = this._getBucket(key);

        for (let i = 0; i < bucket.length; i++) {
            const entry = bucket[i];
            if (entry[0] === key) {
                entry[1] = value;
                return;
            }
        }

        bucket.push([key, value]);
        this.size++;

        if (this.size / this.capacity > this.loadFactor) {
            this.resize();
        }
    }

    get(key) {
        const bucket = this._getBucket(key);

        for (let i = 0; i < bucket.length; i++) {
            const [storedKey, value] = bucket[i];
            if (storedKey === key) {
                return value;
            }
        }

        return null;
    }

    has(key) {
        const bucket = this._getBucket(key);

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                return true;
            }
        }

        return false;
    }

    remove(key) {
        const bucket = this._getBucket(key);

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket.splice(i, 1);
                this.size--;
                return true;
            }
        }

        return false;
    }

    length() {
        return this.size;
    }

    clear() {
        this.capacity = 16;
        this.size = 0;
        this.buckets = new Array(this.capacity).fill(null).map(() => []);
    }

    keys() {
        const keysArray = [];

        for (let i = 0; i < this.buckets.length; i++) {
            const bucket = this.buckets[i];

            for (let j = 0; j < bucket.length; j++) {
                const [key] = bucket[j];
                keysArray.push(key);
            }
        }

        return keysArray;
    }

    values() {
        const valuesArray = [];

        for (let i = 0; i < this.buckets.length; i++) {
            const bucket = this.buckets[i];

            for (let j = 0; j < bucket.length; j++) {
                const [, value] = bucket[j];
                valuesArray.push(value);
            }
        }

        return valuesArray;
    }

    entries() {
        const pairArray = [];

        for (let i = 0; i < this.buckets.length; i++) {
            const bucket = this.buckets[i];

            for (let j = 0; j < bucket.length; j++) {
                pairArray.push(bucket[j]);
            }
        }

        return pairArray
    }

    resize() {
        const oldEntries = this.entries();
        this.capacity *= 2;
        this.size = 0;

        this.buckets = new Array(this.capacity).fill(null).map(() => []);

        for (const [key, value] of oldEntries) {
            this.set(key, value);
        }
    }
}