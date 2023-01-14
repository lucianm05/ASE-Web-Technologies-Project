import Button from "@/components/Button";
import Fieldset from "@/components/Fieldset";
import Input from "@/components/Input";
import dict from "@/constants/dict";
import { useDrawer } from "@/features/drawer/drawer.store";
import { useCreateParkingLot } from "@/features/map/api/createParkingLot";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LocationPayload, ParkingLotPayload } from "types";

interface Props {
  location?: LocationPayload;
}

const ParkingLotForm = ({ location }: Props) => {
  const { register, handleSubmit, setValue, reset } =
    useForm<ParkingLotPayload>({
      defaultValues: {
        name: "",
        capacity: 0,
        fee: 0,
        location: {
          city: location?.city,
          country: location?.country,
          lat: location?.lat,
          lng: location?.lng,
          street: location?.street,
        },
      },
    });

  const { setIsOpen } = useDrawer();
  const createParkingLotHandler = useCreateParkingLot();

  const onSubmit = useCallback(async (payload: ParkingLotPayload) => {
    const res = await createParkingLotHandler(payload);

    if (!res) return;

    setIsOpen(false);
    reset();
  }, []);

  useEffect(() => {
    if (!location) return;

    setValue("location", location);
  }, [location]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      name="parking-lot"
      className="flex flex-col space-y-6"
    >
      <Fieldset label={dict.en.street}>
        <Input
          type="text"
          placeholder={dict.en.street}
          required
          {...register("location.street", { required: true })}
        />
      </Fieldset>

      <Fieldset label={dict.en.city}>
        <Input
          type="text"
          placeholder={dict.en.city}
          required
          disabled
          {...register("location.city", { required: true, disabled: true })}
        />
      </Fieldset>

      <Fieldset label={dict.en.country}>
        <Input
          type="text"
          placeholder={dict.en.country}
          required
          disabled
          {...register("location.country", { required: true, disabled: true })}
        />
      </Fieldset>

      <Fieldset label={dict.en.name}>
        <Input
          type="text"
          placeholder={dict.en.parking_lot_name}
          required
          {...register("name", { required: true })}
        />
      </Fieldset>

      <Fieldset label={dict.en.capacity}>
        <Input
          type="number"
          min={1}
          placeholder={dict.en.parking_lot_capacity}
          required
          {...register("capacity", {
            required: true,
            min: 1,
            valueAsNumber: true,
          })}
        />
      </Fieldset>

      <div className="flex space-x-1">
        <Fieldset label={dict.en.fee}>
          <Input
            type="text"
            min={0}
            placeholder={dict.en.parking_lot_hourly_fee}
            required
            pattern="^\d*\.?\d+$"
            {...register("fee", {
              required: true,
              min: 0,
              pattern: /^\d*\.?\d+$/,
              setValueAs: (value) => value * 100,
            })}
          />
        </Fieldset>

        <div className="self-end bg-white p-1 border font-medium rounded">
          {dict.en.RON}/h
        </div>
      </div>

      <Button type="submit">{dict.en.submit}</Button>
    </form>
  );
};

export default ParkingLotForm;
