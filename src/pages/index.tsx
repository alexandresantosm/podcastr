import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../services/api';
import { converDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  members: string;
  publisheAt: string;
  thumbnail: string;
  description: string;
  url: string;
  duration: number;
  durationAsString: string;
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Home</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publisheAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: episode.thumbnail,
      description: episode.description,
      url: episode.file.url,
      duration: episode.file.duration,
      durationAsString: converDurationToTimeString(Number(episode.file.duration)),
    };
  });

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
