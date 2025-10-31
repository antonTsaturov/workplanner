'use client'
import { useEffect } from "react";
import styles from "./page.module.css";
//import Calendar  from './calendar/page';
import { useRouter } from 'next/navigation';



export default function Home() {

  const router = useRouter();
  //useEffect(()=>{
    //router.push('/auth');
  //})

  return (
      <div className={styles.page}>
        Hello
      </div>
  );
}
