import { Form } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface Props {
  value?: string;
  onChange?: (value?: string) => void;
}

export function PhoneNumberFormControl({ value, onChange }: Props) {
  return (
    <PhoneInput
      placeholder="Informe aqui o celular"
      defaultCountry="BR"
      countrySelectComponent={() => null}
      inputComponent={Form.Control}
      limitMaxLength
      international={false}
      addInternationalOption={false}
      countries={["BR"]}
      numberInputProps={{
        size: "lg",
      }}
      value={(value as any) ?? ""}
      onChange={(e) => onChange?.(e)}
    />
  );
}
