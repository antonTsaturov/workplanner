
import styles from "./page.module.css";
import Calendar  from './calendar/calendar';

export default function Home() {

  return (
    <div className={styles.page}>
      <Calendar />
    </div>
  );
}
