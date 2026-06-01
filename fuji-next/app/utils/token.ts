import Cookies from 'js-cookie';

class Token {
    static getAuthToken = (): string => {
        const token = Cookies.get('token');
        return token || '';
    };
}
export default Token