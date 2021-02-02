import styles from "./CustomCheckbox.module.css";


export default function CustomCheckbox(props) {
  return (
    <span>
      <label>
        <input type="checkbox" className={styles.checkbox} checked={props.checked} />
        <span className={styles.fake}></span>
      </label>
    </span>
  );
}
