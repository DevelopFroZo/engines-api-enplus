import {safeEndpointDecorator} from '@/decorators/safeEndpointDecorator';

function decoratedController<T extends Object>(controller: T): T {
    return new Proxy(controller, {
        get(target, p, receiver) {
            let field = Reflect.get(target, p, receiver) as any;

            if (typeof field === 'function') {
                field = safeEndpointDecorator(field);
            }

            return field;
        },
    });
}

export {decoratedController};
