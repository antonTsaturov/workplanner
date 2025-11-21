'use client'
import { useEffect } from "react";
import styles from "../../page.module.css";
//import { useRouter } from 'next/navigation';
import  Statistics from "../../components/Statistics"


export default function StatisticsPage() {

  return (
    <div style={{display: 'flex' ,justifyContent: 'flex-start', width: '100%'}}>
      <Statistics />
    </div>
  );
}
