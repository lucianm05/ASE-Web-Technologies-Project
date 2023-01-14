import Button from "@/components/Button";
import Fieldset from "@/components/Fieldset";
import Input from "@/components/Input";
import dict from "@/constants/dict";
import { useDrawer } from "@/features/drawer/drawer.store";
import { useCreateParkingLot } from "@/features/map/api/createParkingLot";
import { useDeleteParkingLot } from "@/features/map/api/deleteParkingLot";
import { useEditParkingLot } from "@/features/map/api/editParkingLot";
import useModal from "@/features/modal/modal.store";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LocationPayload, ParkingLotDTO, ParkingLotPayload } from "types";

interface Props {
  parkingLot?: ParkingLotDTO;
  location?: LocationPayload;
}

const ParkingLotForm = ({ parkingLot, location }: Props) => {
  const { register, handleSubmit, setValue, reset, getValues } =
    useForm<ParkingLotPayload>({
      defaultValues: {
        name: parkingLot?.name || "",
        capacity: parkingLot?.capacity || 0,
        fee: parkingLot?.fee ? parkingLot.fee / 100 : 0,
        location: parkingLot?.location
          ? {
              city: parkingLot.location.city,
              country: parkingLot.location.country,
              lat: parkingLot.location.lat,
              lng: parkingLot.location.lng,
              street: parkingLot.location.street,
            }
          : {
              city: location?.city,
              country: location?.country,
              lat: location?.lat,
              lng: location?.lng,
              street: location?.street,
            },
      },
    });

  const { setIsOpen: setIsDrawerOpen } = useDrawer();
  const { setIsOpen: setIsModalOpen, setConfig: setModalConfig } = useModal();

  const createParkingLotHandler = useCreateParkingLot();
  const editParkingLotHandler = useEditParkingLot();
  const deleteParkingLotHandler = useDeleteParkingLot();

  const onSubmit = useCallback(
    async (payload: ParkingLotPayload) => {
      let res: unknown;

      if (parkingLot?.id) {
        res = await editParkingLotHandler(parkingLot.id, payload);
      } else {
        res = await createParkingLotHandler(payload);
      }

      if (!res) return;

      setIsDrawerOpen(false);
      reset();
    },
    [parkingLot]
  );

  useEffect(() => {
    if (parkingLot) {
      setValue("capacity", parkingLot.capacity);
      setValue("fee", parkingLot.fee ? parkingLot.fee / 100 : 0);
      setValue("name", parkingLot.name);
      setValue("location.city", parkingLot.location?.city);
      setValue("location.country", parkingLot.location?.country);
      setValue("location.lat", parkingLot.location?.lat);
      setValue("location.lng", parkingLot.location?.lng);
      setValue("location.street", parkingLot.location?.street);
      return;
    }

    if (!location) return;

    setValue("location", location);
  }, [parkingLot, location]);

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
          {...register("location.city", { required: true })}
        />
      </Fieldset>

      <Fieldset label={dict.en.country}>
        <Input
          type="text"
          placeholder={dict.en.country}
          required
          {...register("location.country", { required: true })}
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

      <div className="flex justify-between">
        {!parkingLot && (
          <Button
            type="submit"
            aria-label={dict.en.submit}
            title={dict.en.submit}
          >
            {dict.en.submit}
          </Button>
        )}

        {parkingLot && (
          <>
            <Button
              type="submit"
              aria-label={dict.en.edit}
              title={dict.en.edit}
            >
              {dict.en.edit}
            </Button>

            <Button
              theme="danger"
              aria-label={dict.en.delete}
              title={dict.en.delete}
              onClick={() => {
                setModalConfig({
                  header: dict.en.are_you_sure,
                  body: (
                    <span>
                      Are you sure you want to delete parking lot{" "}
                      <b>{parkingLot.name}</b>?
                    </span>
                  ),
                  footer: (
                    <>
                      <Button
                        aria-label={dict.en.cancel}
                        title={dict.en.cancel}
                        onClick={() => setIsModalOpen(false)}
                      >
                        {dict.en.cancel}
                      </Button>

                      <Button
                        theme="danger"
                        aria-label={dict.en.delete}
                        title={dict.en.delete}
                        className="ml-auto"
                        onClick={async () => {
                          if (!parkingLot.id) return;

                          const res = await deleteParkingLotHandler(
                            parkingLot.id
                          );

                          if (!res) return;

                          setIsModalOpen(false);
                          setIsDrawerOpen(false);
                        }}
                      >
                        {dict.en.delete}
                      </Button>
                    </>
                  ),
                  classNames: {
                    footer: "flex justify-between items-center",
                  },
                });
                setIsModalOpen(true);
              }}
            >
              {dict.en.delete}
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default ParkingLotForm;
