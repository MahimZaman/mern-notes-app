//export const BASE_URL = process.env.REACT_APP_BASE_URL;

const { VITE_APP_BASE_URL } = import.meta.env;

const config = () => {
    return { VITE_APP_BASE_URL };
}

export default config() ;