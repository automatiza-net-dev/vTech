import { TypesAutomatiza, container } from "@/container";

export function remote<T>(Item: { new (...args: any[]): T }): T {
    return container.get(TypesAutomatiza[Item.name]) as T;
}
