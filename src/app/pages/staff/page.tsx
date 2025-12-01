'use client'
import { useEffect } from "react";
import styles from "../../page.module.css";
import { useRouter } from 'next/navigation';
import  Staff from "../../components/Staff"
import Loader  from '../../components/Loader';
import { usePageLoad } from '../../hooks/usePageLoad';


export default function StaffPage() {
  
  const {pageIsLoad} = usePageLoad();

  return (
    <div style={{display: 'flex' ,justifyContent: 'flex-start', width: '100%'}}>
      { !pageIsLoad ? <Loader /> : <Staff/> }
    </div>
  );
}
