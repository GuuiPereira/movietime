import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';

import { MdAccessTime, MdAttachMoney, MdMoneyOff } from 'react-icons/md';
import { ImYoutube2, ImVimeo2 } from 'react-icons/im';

import { convertMinutesToTimeString } from '../../utils/convertMinutesToTimeString';
import { convertNumberToMoney } from '../../utils/convertNumberToMoney';
import Head from "next/head";

import styles from './movie.module.scss';
import { useState } from 'react';

type Movie = {
  adult: boolean,
  backdrop_path: string,
  belongs_to_collection: string,
  budget: number,
  genres: { id: number, name: string }[],
  homepage: string,
  id: number,
  imdb_id: string,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,
  poster_path: string,
  production_companies: { id: 12648, logo_path: string, name: string, origin_country: string }[]
  production_countries: { iso_3166_1: string, name: string }[]
  release_date: string,
  revenue: number,
  runtime: number,
  spoken_languages: [{ english_name: string, iso_639_1: string, name: string, }]
  status: string,
  tagline: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count: number,
  principalActors: Cast[],
  crew: Crew[],
  trailer: Video
}

type Cast = {
  adult: boolean,
  cast_id: number,
  character: string,
  credit_id: string,
  gender: number,
  id: number,
  known_for_department: string,
  name: string,
  order: number,
  original_name: string,
  popularity: number,
  profile_path: string,
}

type Person = {
  birthday: string,
  known_for_department: string,
  deathday: string,
  id: number,
  name: string,
  also_known_as: string[],
  gender: number,
  biography: string,
  popularity: string,
  place_of_birth: string,
  profile_path: string,
  adult: boolean,
  imdb_id: string,
  homepage: string,
}

type Crew = {
  dult: boolean,
  credit_id: string,
  department: string,
  gender: number,
  id: number,
  job: string, // "Director"
  known_for_department: string,
  name: string,
  original_name: string,
  popularity: number,
  profile_path: string,
}

type Video = {
  id: string,
  iso_639_1: string,
  iso_3166_1: string,
  key: string,
  name: string,
  site: string,
  size: number,
  type: string,
}

type MovieProps = {
  movie: Movie;
}

export default function Episode({ movie }: MovieProps) {

  const [actorDetailsList, setActorDetailsList] = useState([] as Person[]);
  const clickSeeMore = async (e, id: number) => {

    const target: HTMLButtonElement = e.target;
    const card = target.closest('.' + styles.card);
    const card2 = card.querySelector('.' + styles.cardColumn2)
    card2.classList.toggle(styles.fadeIn);
    await getActorInfo(id);

  }

  const getActorInfo = async (id: number) => {

    const filter = actorDetailsList.filter(item => item.id === id);
    if (filter.length > 0) {

      return;
      
    }

    const { data } = await api.get(`/person/${id}`, {
      params: {
        api_key: '8a4c6b0f0998443743f4f5999a261c84',
        language: 'pt-BR',
      }
    });

    const list = [...actorDetailsList];
    list.push(data);
    setActorDetailsList(list);

  }

  const st = {
    img: {
      background: `url("http://image.tmdb.org/t/p/w1280/${movie.backdrop_path}")`
    }
  };

  return (
    <div className={styles.movie}>
      <Head>
        <title>{movie.title}</title>

      </Head>
      <div className={styles.thumbnailContainer} style={st.img}>
        <div className={styles.divContent}>
          <div className={styles.divThumb}>
            <img src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}></img>
          </div>
          <div className={styles.divInfo}>
            <h1>{`${movie.title}(${movie.status})`}</h1>
            <h3>Enredo</h3>
            <p>{movie.overview}</p>
            <h3>Gêneros</h3>
            <p>{movie.genres.map(genres => genres.name).join(',')}</p>
            <h3>Diretor(a)</h3>
            <p>{movie.crew.filter(crew => crew.job === 'Director').map((c) => c.name).join(',')}</p>
            <div>
              <div>
                <MdAccessTime fontSize={30}></MdAccessTime>
                <p>Tempo: {convertMinutesToTimeString(movie.runtime)}</p>
              </div>
              <div>
                <MdMoneyOff fontSize={30}></MdMoneyOff>
                <p>Custo: {convertNumberToMoney(movie.budget)}</p>
              </div>
              <div>
                <MdAttachMoney fontSize={30}></MdAttachMoney>
                <p>Renda: {convertNumberToMoney(movie.revenue)}</p>
              </div>
            </div>
          </div>
          {!movie.trailer ? (null) :

            movie.trailer && movie.trailer.site === 'YouTube' ? (
              <a target={'_blank'} href={`https://www.youtube.com/watch?v=${movie.trailer.key}`} className={styles.divSeeVideo}>
                <ImYoutube2 fontSize={80} ></ImYoutube2>
              </a>
            ) : (
              <a target={'_blank'} href={`https://vimeo.com/${movie.trailer?.key}`} className={styles.divSeeVideo}>
                <ImVimeo2 fontSize={50} ></ImVimeo2>
              </a>
            )
            
          }

        </div>

      </div>

      <div className={styles.movieActors}>
        <h1>Principais atores</h1>
        <div className={styles.movieActorsGrid}>
          {movie.principalActors.map((actor, index) => {

            const actorInfo = actorDetailsList.find(item => item.id === actor.id);

            return (
              <div key={actor.id} className={styles.movieActorsGridItem}>

                <div className={styles.card}>
                  <div className={styles.cardColumn1}>
                    <div className={styles.profile}>
                      <div className={styles.image}>
                        <div className={styles.circle1}></div>
                        <div className={styles.circle2}></div>
                        <img src={`http://image.tmdb.org/t/p/w154${actor.profile_path}`} width="70" height="70" alt={actor.name} />
                      </div>
                      <div className={styles.name}>{actor.name}</div>
                      <div className={styles.job}>{actor.character}</div>
                      <div className={styles.actions}>
                        <button onClick={(e) => { clickSeeMore(e, actor.id) }} className={styles.btnFollow}>Ver mais</button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardColumn2}>
                    <div className={styles.box}>
                      <span className={styles.value}>{actorInfo?.popularity}</span>
                      <span className={styles.parameter}>Popularidade</span>
                    </div>
                    <div className={styles.box}>
                      <span className={styles.value}>{actorInfo?.birthday}</span>
                      <span className={styles.parameter}>Aniversário</span>
                    </div>
                    <div className={styles.box}>
                      <span className={styles.value}>{actorInfo?.place_of_birth}</span>
                      <span className={styles.parameter}>Local de Nascimento</span>
                    </div>

                  </div>
                </div>


              </div>
            )
          })}

        </div>
      </div>

    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const paths = []
  return {
    paths,
    fallback: 'blocking'
  }

}
export const getStaticProps: GetStaticProps = async (ctx) => {
  
  const { movie } = ctx.params;
  const info = await api.get(`/movie/${movie}`, {
    params: {
      api_key: '8a4c6b0f0998443743f4f5999a261c84',
      language: 'pt-BR',
    }
  });

  const credits = await api.get(`/movie/${movie}/credits`, {
    params: {
      api_key: '8a4c6b0f0998443743f4f5999a261c84',
      language: 'pt-BR',
    }
  });

  const respVideo = await api.get(`/movie/${movie}/videos`, {
    params: {
      api_key: '8a4c6b0f0998443743f4f5999a261c84',
      language: 'pt-BR',
    }
  });

  const videos: Video[] = respVideo.data.results;
  const ret: Movie = info.data;

  ret.principalActors = credits.data.cast.slice(0, 8);
  ret.crew = credits.data.crew;
  if (videos.length > 0) {

    ret.trailer = videos[0];

  }

  return {
    props: {
      movie: ret,
    },
    revalidate: 60 * 60 * 24, // 24Hours
  }
};