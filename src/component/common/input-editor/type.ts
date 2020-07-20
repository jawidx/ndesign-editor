export interface PropsDefined {
    type?: 'input' | 'json'
    inputType?: 'PD' | 'simplePD' | 'specPD'
    value?: any
    onChange?: (value: any) => void
}