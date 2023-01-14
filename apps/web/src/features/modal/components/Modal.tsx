import Button from "@/components/Button";
import dict from "@/constants/dict";
import useModal from "@/features/modal/modal.store";
import { ReactComponent as IconClose } from "@/assets/icons/close.svg";
import Separator from "@/components/Separator";

const Modal = () => {
  const {
    isOpen,
    setIsOpen,
    config: { header, body, footer, classNames },
  } = useModal();

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 flex items-center justify-center">
      <div className="bg-white w-full max-w-[420px] min-h-[300px] flex flex-col justify-between rounded shadow-lg z-20">
        <header
          className={`flex justify-between space-x-2 items-center font-medium text-lg p-4 ${classNames?.header}`}
        >
          {header}

          <Button
            theme="none"
            aria-label={dict.en.close_modal}
            title={dict.en.close_modal}
            onClick={() => setIsOpen(false)}
            className="ml-auto"
          >
            <IconClose width={24} height={24} />
          </Button>
        </header>

        {body && (
          <>
            <Separator />

            <main className={`p-4 flex-1 ${classNames?.body}`}>{body}</main>
          </>
        )}

        {footer && (
          <>
            <Separator />

            <footer className={`p-4 ${classNames?.footer}`}>{footer}</footer>
          </>
        )}
      </div>

      <button
        className="bg-black bg-opacity-25 absolute top-0 left-0 w-full h-full cursor-default z-10"
        aria-label={dict.en.close_modal}
        onClick={() => setIsOpen(false)}
      >
        <span className="sr-only">{dict.en.close_modal}</span>
      </button>
    </div>
  );
};

export default Modal;
