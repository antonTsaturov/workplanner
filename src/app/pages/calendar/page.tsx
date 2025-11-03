'use client'
import { useEffect } from "react";
import styles from "../../page.module.css";
import FullCalendar  from '../../components/FullCalendar';
import { useRouter } from 'next/navigation';



export default function Calendar() {

  return (
    <div >
      <FullCalendar/>
    </div>
  );
}
