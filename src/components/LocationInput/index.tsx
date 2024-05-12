import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { useAsyncList } from "react-stately";

import { useCallback, useEffect, useRef, useState } from "react";
import { Map } from "../HereMaps/Map";
import { Form, Spinner } from "react-bootstrap";
import { Position } from "../../config/define";
import { mdiChevronDown } from "@mdi/js";
import Icon from "@mdi/react";

const apiUrl = `https://geocode.search.hereapi.com/v1/geocode?apiKey=${import.meta.env.VITE_HERE_API_KEY}&in=countryCode:BRA&lang=pt-BR&types=address&at=-30.001862,-51.310945&q=`;

const searchLocation = async (
  search?: string,
  signal?: AbortSignal,
): Promise<{ items: Location[] }> => {
  if (!search || search.length < 6) return Promise.resolve({ items: [] });

  const response = await fetch(apiUrl + search + ", RS", { signal });
  const data = await response.json();
  return data;
};

type Location = {
  title: string;
  id: string;
  position: Position;
};

type LocationInputProps = {
  currentUserPosition: Position | null;
  onChange?: (position: Position | null) => void;
};

export function LocationInput({
  currentUserPosition: currentUserPosition,
  onChange,
}: LocationInputProps) {
  const mapRef = useRef<H.Map>(null);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );

  const selectPosition = useCallback(
    (position: Position | null) => {
      setSelectedPosition(position);
      onChange?.(position);
    },
    [onChange],
  );

  const list = useAsyncList<Location>({
    async load({ signal, filterText }) {
      return await searchLocation(filterText, signal);
    },
  });

  useEffect(() => {
    if (isCurrentLocation) {
      selectPosition(currentUserPosition);
    }
  }, [isCurrentLocation, currentUserPosition, selectPosition]);

  useEffect(() => {
    mapRef.current?.removeObjects(mapRef.current?.getObjects());
    if (selectedPosition) {
      mapRef.current?.setCenter(selectedPosition);
      mapRef.current?.addObject(new H.map.Marker(selectedPosition));
    }
  }, [selectedPosition]);

  return (
    <ComboBox
      isDisabled={isCurrentLocation}
      items={list.items}
      inputValue={list.filterText}
      onInputChange={list.setFilterText}
      onSelectionChange={(key) => {
        const item = list.items.find((i) => i.id === key);
        if (item) {
          selectPosition(item.position);
        } else {
          selectPosition(null);
        }
      }}
      shouldFocusWrap
      menuTrigger="input"
      formValue="key"
      className="d-flex flex-column gap-2"
      onFocus={(e) => {
        setTimeout(() => {
          const top = e.target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: top - 45, behavior: "smooth" });
        }, 100);
      }}
    >
      <Label>Localização (Endereço)</Label>
      <div className="input-group">
        <Input className="form-control" />
        <Button className="btn btn-secondary" type="button">
          {list.isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Icon path={mdiChevronDown} size="16px" />
          )}
        </Button>
      </div>
      <Popover offset={2}>
        <ListBox<Location>
          className="list-group overflow-auto"
          style={{ width: "var(--trigger-width)", maxHeight: "50svh" }}
        >
          {(item) => (
            <ListBoxItem
              id={item.id}
              key={item.id}
              className="list-group-item list-group-item-action"
            >
              {item.title}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
      <Form.Check
        type="switch"
        label="Utilizar minha localização atual"
        id="utilizar"
        className="mb-3 form-switch-md"
        onChange={(e) => {
          setIsCurrentLocation(e.currentTarget.checked);
          if (!e.currentTarget.checked) {
            selectPosition(null);
          }
        }}
      />
      <Map
        apikey={import.meta.env.VITE_HERE_API_KEY}
        initialPosition={currentUserPosition}
        ref={mapRef}
        className="my-3"
      />
    </ComboBox>
  );
}
