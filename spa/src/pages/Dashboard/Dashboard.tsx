import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Dashboard() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/health')
            .then(res => setMessage(res.data.message))
            .catch(err => console.error(err));
    }, []);

    return <div className="p-5 text-center text-xl ">{message}</div>;
}
