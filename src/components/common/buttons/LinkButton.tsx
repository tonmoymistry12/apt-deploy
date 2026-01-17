import {
    Button
  } from '@mui/material';
import styles from './styles.module.scss';

interface LinkButton {
  text:String,
  size: any,
  onClick: () => void
}

const LinkButton = ({ text, size, onClick }: LinkButton) => {
  return (
    <Button
    onClick={onClick}
    className={styles.textButton}
    size={size}
  >
   {text}
  </Button>
  );
};

export default LinkButton; 