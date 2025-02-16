export class ClassValidatorMessages {
  public static IsString = (param: string): string => `O campo ${param} deve ser uma string.`;

  public static Length = (param: string, min: number, max: number) =>
    `O campo ${param} deve ter entre ${min} e ${max} caracteres.`;

  public static IsEmal = (param: string) => `O campo ${param} deve ser um email válido.`;
}
