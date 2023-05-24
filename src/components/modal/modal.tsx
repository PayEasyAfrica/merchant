import styles from "./modal.module.css";
import textStyles from "../../app/text.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Util } from "@/util";

type ModalProps = {
  title?: string;
  children?: React.ReactNode;
  visible?: boolean;
  onClose?(): unknown;
  afterClose?(): unknown;
};

export const Modal = (props: ModalProps) => {
  const { visible, afterClose, onClose } = props;
  const [modalClass, setModalClass] = useState(styles.modal);

  useEffect(() => {
    const visibleModal = Util.classNames(styles.modal, styles.showModal);
    if (visible) {
      setModalClass(visibleModal);
    } else if (modalClass === visibleModal) {
      setModalClass(styles.modal);
      setTimeout(() => {
        if (afterClose) {
          afterClose();
        }
      }, 500);
    }
  }, [visible, afterClose, modalClass]);

  return (
    <div className={modalClass}>
      <div onClick={onClose} className={styles.modalOverlay}></div>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          {!!props.title ? (
            <p className={textStyles.headlineSmall}>{props.title}</p>
          ) : null}

          <button onClick={props.onClose}>
            <Image
              src="/svg_icons/close.svg"
              alt="Close Icon"
              width={24}
              height={24}
              priority
            />
          </button>
        </div>

        <div className={styles.modalBody}>{props.children}</div>
      </div>
    </div>
  );
};
