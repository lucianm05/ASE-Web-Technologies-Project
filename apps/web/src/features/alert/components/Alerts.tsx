import useAlert from "@/features/alert/alert.store";
import Alert from "@/features/alert/components/Alert";

const Alerts = () => {
  const { alerts } = useAlert();

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
      {alerts.map((alert) => (
        <Alert key={alert.id} {...alert} />
      ))}
    </div>
  );
};

export default Alerts;
