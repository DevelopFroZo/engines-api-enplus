export default () => ({
    configs: [
        {
            name: 'gvg',
            label: 'Grid Visual Graph',
            parameters: [
                {
                    name: 'windowsCount',
                    description: 'Количество окон',
                },
            ],
        },
        {
            name: 'lpvg',
            label: 'LPVG',
            parameters: [
                {
                    name: 'M1',
                    description: 'M1',
                },
                {
                    name: 'M2',
                    description: 'M2',
                },
            ],
        },
    ],
});
