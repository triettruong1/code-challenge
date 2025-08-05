export interface UserProps {
  id: string;
  name: string;
  age: number;
  email: string;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  id(): string {
    return this.props.id;
  }

  name(): string {
    return this.props.name;
  }

  getAge(): number {
    return this.props.age;
  }

  getEmail(): string {
    return this.props.email;
  }
}
