// @ts-nocheck
/* eslint-disable react/display-name */
import React, { Ref, PropsWithChildren } from "react";
import { cx, css } from "@emotion/css";

interface BaseProps {
    className: string;
    [key: string]: unknown;
}
type OrNull<T> = T | null;

export const Button = React.forwardRef(
    (
        {
            className,
            active,
            reversed,
            ...props
        }: PropsWithChildren<
            {
                active: boolean;
                reversed: boolean;
            } & BaseProps
        >,
        ref: Ref<OrNull<HTMLSpanElement>>
    ) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    cursor: pointer;
                    color: ${reversed
                        ? active
                            ? "white"
                            : "#aaa"
                        : active
                        ? "black"
                        : "#ccc"};
                `
            )}
        />
    )
);

export const Icon = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<OrNull<HTMLSpanElement>>
    ) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                "material-icons",
                className,
                css`
                    font-size: 18px;
                    vertical-align: text-bottom;
                `
            )}
        />
    )
);

export const Menu = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<OrNull<HTMLDivElement>>
    ) => (
        <div
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    & > * {
                        display: inline-block;
                    }
                    & > * + * {
                        margin-left: 15px;
                    }
                `
            )}
        />
    )
);

export const Toolbar = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<OrNull<HTMLDivElement>>
    ) => (
        <Menu
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    position: relative;
                    padding: 1px 18px 17px;
                    margin: 0 -20px;
                    border-bottom: 2px solid #eee;
                    margin-bottom: 20px;
                `
            )}
        />
    )
);
