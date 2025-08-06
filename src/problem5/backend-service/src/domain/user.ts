import { InvalidInputError } from "./errors/InvalidInputError";

export interface UserProps {
  name: string;
  age: number;
  email: string;
}

const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class User {
  private _id: string;
  private props: UserProps;

  constructor(props: UserProps, id?: string) {
    this.props = props;
    if (id) {
      this._id = id;
    } else {
      this._id = crypto.randomUUID();
    }
  }

  id(): string {
    return this._id;
  }

  name(): string {
    return this.props.name;
  }

  age(): number {
    return this.props.age;
  }

  email(): string {
    return this.props.email;
  }

  static create(props: UserProps, id?: string): User {
    const { name, age, email } = props;

    if (age < 1 || age > 120) {
      throw new InvalidInputError("Age must be between 1 and 120");
    }

    if (typeof name !== "string" || name.trim() === "") {
      throw new InvalidInputError("Name must be a non-empty string");
    }
    if (!nameRegex.test(name)) {
      throw new InvalidInputError("Name can only contain letters and spaces");
    }

    if (!emailRegex.test(email)) {
      throw new InvalidInputError("Email is not valid");
    }

    return new User({ name, age, email }, id);
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this.props.name,
      age: this.props.age,
      email: this.props.email,
    };
  }
}
