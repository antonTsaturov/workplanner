'use client'
import { useEffect } from "react";
import styles from "../../page.module.css";
//import { useRouter } from 'next/navigation';
import  Statistics from "../../components/Statistics"
import Loader  from '../../components/Loader';
import { usePageLoad } from '../../hooks/usePageLoad';


export default function StatisticsPage() {
  
  const {pageIsLoad} = usePageLoad();
  
  return (
    <div style={{display: 'flex' ,justifyContent: 'flex-start', width: '100%'}}>
      { !pageIsLoad ? <Loader /> : <Statistics/> }
    </div>
  );
}
