
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from 'next';
import { api } from "../services/api"

import styles from './home.module.scss';
import { useEffect, useRef, useState } from "react";
import React from "react";

type Movie = {
  adult: boolean,
  backdrop_path: string,
  genre_ids: number[],
  id: number,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,
  poster_path: string,
  release_date: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count: number
}

type MovieResponse = {
  page: number,
  results: Movie[],
  total_pages: number,
  total_results: number,
}

type HomeProps = {
  spotlightMovie: Movie,
  allMovies: Movie[]
}

export default function Home({ spotlightMovie, allMovies }: HomeProps) {

  const backgroundRef = useRef<HTMLDivElement>(null);
  const [allMoviesList, setAllMoviesList] = useState([] as Movie[]);
  const [lastMoviesList, setLastMoviesList] = useState([] as Movie[]);
  const [isFetching, setIsFetching] = useState(false);
  const [actualPage, setActualPage] = useState(1);
  let searchTimeout;

  useEffect(() => {
    // window is accessible here.
    setAllMoviesList(allMovies);
    console.log(backgroundRef.current)
    backgroundRef.current.style.background = `linear-gradient(rgba(0, 0, 0, 0) 39%,rgba(0, 0, 0, 0) 41%, rgba(0, 0, 0, 0.65) 100%),url(http://image.tmdb.org/t/p/w1280/${spotlightMovie.backdrop_path}),rgb(28, 28, 28)`;
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

  }, []);

  useEffect(() => {
    if (!isFetching) return;
    setActualPage(actualPage + 1);
    loadMoreMovies();
  }, [isFetching]);


  function handleScroll() {

    if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {

      setIsFetching(true);

    }
  }

  async function loadMoreMovies() {

    const { data } = await api.get('movie/popular', {
      params: {
        api_key: '8a4c6b0f0998443743f4f5999a261c84',
        language: 'pt-BR',
        page: actualPage + 1
      }
    });

    const res: MovieResponse = data;
    const list = allMoviesList;
    const newList: Movie[] = res.results;
    const listResult = list.concat(newList);
    setAllMoviesList(listResult);
    setIsFetching(false);

  }

  async function searchMovie(key: string) {

    if (searchTimeout) clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {

      if (key === '') {

        setAllMoviesList([...lastMoviesList]);
        setLastMoviesList([]);
        return;

      }
      if (lastMoviesList.length === 0) setLastMoviesList([...allMoviesList]);
      const { data } = await api.get('search/movie/', {
        params: {
          api_key: '8a4c6b0f0998443743f4f5999a261c84',
          language: 'pt-BR',
          query: key
        }
      });

      const res: MovieResponse = data;
      const searchRC: Movie[] = res.results;
      setAllMoviesList(searchRC);
    }, 500);

  }

  return (
    <div className={styles.containerHomepage} >
      <Head>
        <title>Home | MovieTime</title>
      </Head>

      <section
        className={styles.spotlight}>
        <div
          className={styles.spotlightImage} ref={backgroundRef}>
          <div>
            <h1>{spotlightMovie.title}</h1>
            <p>{spotlightMovie.overview}</p>
          </div>

        </div>

      </section>

      <div className={styles.searchContainer}>

        <input type="text"
          placeholder="Search"
          onInput={(e) => {
            searchMovie(e.currentTarget.value)
          }}>
        </input>
        <div className={styles.search}></div>

      </div>

      <section className={styles.allMovies}>
        <h1>Filmes Populares</h1>
        <div className={styles.movieGrid}>
          {allMoviesList.map((movie, index) => {
            return (
              <div key={movie.id} className={styles.movieGridItem}>
                <div>
                  <Link href={`/movie/${movie.id}`}>
                    <a>
                      <img src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}>
                      </img>
                    </a>
                  </Link>
                </div>

              </div>
            )
          })}
        </div>

      </section>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('movie/popular', {
    params: {
      api_key: '8a4c6b0f0998443743f4f5999a261c84',
      language: 'pt-BR',
      page: 1
    }
  });

  const res: MovieResponse = data;
  const spotlightMovie: Movie = res.results[0];
  const allMovies: Movie[] = res.results;

  return {
    props: {
      spotlightMovie,
      allMovies
    },
    revalidate: 60 * 60 * 8, // 8 hours
  }
}
