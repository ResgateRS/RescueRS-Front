import ListGroup from "react-bootstrap/ListGroup";
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";
import { Button } from "react-bootstrap";

type RestageItemProps = {
  totalPeopleNumber: number;
  childrenNumber: number;
  elderlyNumber: number;
  animalsNumber: number;
  latitude: number;
  longitude: number;
};

export default function RestageItem(props: RestageItemProps) {
  const itemClass =
    "d-flex align-items-center gap-2 w-100 justify-content-center";

  return (
    <ListGroup.Item action>
      <div className="d-flex gap-2">
        <div className={itemClass}>Pessoas: {props.totalPeopleNumber}</div>

        {props.childrenNumber >= 0 && (
          <div className={itemClass}>Crianças: {props.childrenNumber}</div>
        )}

        {props.elderlyNumber >= 0 && (
          <div className={`${itemClass} .hidden-xs`}>
            Idosos: {props.elderlyNumber}
          </div>
        )}

        {props.animalsNumber >= 0 && (
          <div className={itemClass}>Animais: {props.animalsNumber}</div>
        )}

        <div className={itemClass}>
          <Button
            as="a"
            variant="info"
            target="_blank"
            size="sm"
            href={`https://www.google.com/maps/place/${props.latitude},${props.longitude}`}
          >
            <Icon path={mdiMapMarker} size="1.5em" />
          </Button>
        </div>
      </div>
    </ListGroup.Item>
  );
}
