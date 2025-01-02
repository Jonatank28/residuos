import AsyncStorage from '@react-native-async-storage/async-storage';
const str = (value: any) => JSON.stringify(value);

export const setString: (key: string, value: string) => Promise<void> = async (key: string, value: string) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(key, value).then(resolve).catch(reject);
    });
};

export const getString: (key: string) => Promise<string> = async (key: string) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key).then(value => {
            resolve(value || '');
        }).catch(reject);
    });
};

export const setObject: <T>(key: string, value: T) => Promise<void> = async <T>(key: string, value: T) => {
    return new Promise((resolve, reject) => {
        setString(key, JSON.stringify(value)).then(resolve).catch(reject);
    });
};

export const getObject: <T>(key: string) => Promise<T> = async <T>(key: string) => {
    return new Promise((resolve, reject) => {
        getString(key).then(value => {
            resolve(JSON.parse(value || '{}'));
        }).catch(reject);
    });
};

export const setArray: <T>(key: string, value: T[]) => Promise<void> = async <T>(key: string, value: T[]) => {
    return new Promise((resolve, reject) => {
        setString(key, JSON.stringify(value)).then(resolve).catch(reject);
    });
};

export const getArray: <T>(key: string) => Promise<T[]> = async <T>(key: string) => {
    return new Promise((resolve, reject) => {
        getString(key).then(value => {
            resolve((JSON.parse(value || '[]')));
        }).catch(reject);
    });
};

export const removeFromArray: <T>(key: string, value: T) => Promise<void> = async <T>(key: string, value: T) => {
    return new Promise((resolve, reject) => {
        getArray<T>(key).then(array => {
            setArray(key, array.filter(item => str(item) !== str(value))).then(resolve).catch(reject);
        }).catch(reject);
    });
}

export const appendToArray: <T>(key: string, value: T) => Promise<void> = async <T>(key: string, value: T) => {
    return new Promise((resolve, reject) => {
        getArray<T>(key).then(array => {
            setArray(key, [...array, value]).then(resolve).catch(reject);
        }).catch(reject);
    });
}

export const mergeArray: <T>(key: string, value: T[]) => Promise<void> = async <T>(key: string, value: T[]) => {
    return new Promise((resolve, reject) => {
        getArray<T>(key).then(array => {
            setArray(key, [...array, ...value]).then(resolve).catch(reject);
        }).catch(reject);
    });
}

export const clearStorage: () => Promise<void> = async () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.clear().then(resolve).catch(reject);
    });
};

export const removeItem: (key: string) => Promise<void> = async (key: string) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(key).then(resolve).catch(reject);
    });
};