'use client'
import { useEffect } from "react";
import styles from "../../page.module.css";
import { useRouter } from 'next/navigation';
import  Staff from "../../components/Staff"


export default function StaffPage() {

  return (
    <div style={{display: 'flex' ,justifyContent: 'flex-start', width: '100%'}}>
      <Staff/>
    </div>
  );
}
