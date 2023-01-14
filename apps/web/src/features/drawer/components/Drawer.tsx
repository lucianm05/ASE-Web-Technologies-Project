import { ReactComponent as IconClose } from "@/assets/icons/close.svg";
import Button from "@/components/Button";
import dict from "@/constants/dict";
import { useDrawer } from "@/features/drawer/drawer.store";
import classes from "./Drawer.module.scss";

const Drawer = () => {
  const {
    isOpen,
    setIsOpen,
    config: { header, body, footer },
  } = useDrawer();

  return (
    <aside
      className={`w-full max-w-[320px] fixed top-0 right-0 h-full bg-slate-50 z-10 p-4 drop-shadow-xl flex flex-col ${
        classes.drawer
      } ${isOpen && classes["drawer__open"]}`}
    >
      <header className="flex justify-between">
        <div>{header}</div>

        <Button
          className="self-start"
          onClick={() => setIsOpen(false)}
          aria-label={dict.en.close_drawer}
          title={dict.en.close_drawer}
          theme="none"
        >
          <IconClose width={32} height={32} />
        </Button>
      </header>

      {body && <main className="py-6 flex-1">{body}</main>}

      {footer && <footer>{footer}</footer>}
    </aside>
  );
};

export default Drawer;
