import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';


type Tanzaku = {
  id: string;
  name: string;
  wish: string;
};

export default function Home() {
  const [name, setName] = useState<string>('');
  const [wish, setWish] = useState<string>('');
  const [tanzakus, setTanzakus] = useState<Tanzaku[]>([]);

  useEffect(() => {
    const fetchTanzakus = async () => {
      try {
        const response = await axios.get<Tanzaku[]>('http://localhost:8000/api/tanzaku');
        setTanzakus(response.data);
      } catch (error) {
        console.error('Error fetching tanzakus:', error);
      }
    };

    fetchTanzakus();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post<{ id: string }>('http://localhost:8000/api/tanzaku', { name, wish });
      const newTanzaku: Tanzaku = { id: response.data.id, name, wish };
      setTanzakus([...tanzakus, newTanzaku]);
      setName('');
      setWish('');
    } catch (error) {
      console.error('Error posting tanzaku:', error);
    }
  };

  return (
    <div>
      <h1>短冊投稿サイト</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="投稿者名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="願い事"
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          required
        />
        <button type="submit">投稿</button>
      </form>
      <h2>短冊一覧</h2>
      <ul>
        {tanzakus.map(tanzaku => (
          <li key={tanzaku.id}>
            <strong>{tanzaku.name}</strong>: {tanzaku.wish}
          </li>
        ))}
      </ul>
    </div>
  );
}
