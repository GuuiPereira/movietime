import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import Link from "next/link";

import { MdLocalMovies } from 'react-icons/md';
import styles from './styles.module.scss';

export function Header() {

  const currentDate = format(new Date(), 'EEEEEE, d MMMM', { locale: ptBR })

  return (
    <header className={styles.containerHeader}>

      <Link href={'/'}>
        <a>
          <MdLocalMovies fontSize={70} />
          <p>MovieTime</p>
          <span>Tudo sobre filmes</span>
        </a>
      </Link>

      <span>{currentDate}</span>
    </header>
  )
}