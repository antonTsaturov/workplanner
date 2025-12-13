'use client'
import FullCalendar  from '../../components/FullCalendar';
import Loader  from '../../components/Loader';
import { usePageLoad } from '../../hooks/usePageLoad';


export default function Calendar() {

  const {pageIsLoad} = usePageLoad();
  
  return (
    <div>
      { !pageIsLoad ? <Loader /> : <FullCalendar/> }
    </div>
  );
}
