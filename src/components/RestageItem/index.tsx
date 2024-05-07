import ListGroup from "react-bootstrap/ListGroup";

type RestageItemProps = {
  totalPeopleNumber: number;
  childrenNumber: number;
  elderlyNumber: number;
  animalsNumber: number;
};

export default function RestageItem(props: RestageItemProps) {
  const itemClass =
    "d-flex align-items-center gap-2 w-100 justify-content-center";

  return (
    <ListGroup.Item action>
      <div className="d-flex gap-2">
        <div className={itemClass}>Pessoas: {props.totalPeopleNumber}</div>

        <div className={itemClass}>Crianças: {props.childrenNumber}</div>

        <div className={`${itemClass} .hidden-xs`}>
          Idosos: {props.elderlyNumber}
        </div>

        <div className={itemClass}>Animais: {props.animalsNumber}</div>

        <div className={itemClass}></div>
      </div>
    </ListGroup.Item>
  );
}
