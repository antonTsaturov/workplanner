'use client'
import { useEffect } from "react";
import styles from "../../page.module.css";
import FullCalendar  from '../../components/FullCalendar';
import { useRouter } from 'next/navigation';
import Loader  from '../../components/Loader';
import { usePageLoad } from '../../hooks/usePageLoad';


export default function Calendar() {

  const {pageIsLoad} = usePageLoad();
  
  return (
    <div style={{display:'flex', width: '100%'}}>
      { !pageIsLoad ? <Loader /> : <FullCalendar/> }
    </div>
  );
}
