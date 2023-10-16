"use client";

import { ComponentProps } from "react";
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type FormSumitButtonProps = {
    children :React.ReactNode, 
    className?: string,
} & ComponentProps<'button'>

// Animación de carga del botón "AGREGAR SERVICIO"

export default function FormSumitButton({
    children, 
    className,
    ...props
} : FormSumitButtonProps){
    const {pending } = useFormStatus();

    return(
        <button
            {...props}
            className={'btn btn-primary ${className}'}
            type="submit"
            disabled={pending}
        >
            {pending && <span className="loading loading-spinner" />}
            {children}</button>
    );
}