import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyExchange',
    standalone: true
})
export class CurrencyExchangePipe implements PipeTransform{

    private exchangeRates: {[key: string]:number}= {
        'USD': 1,
        'EUR': 0.86,
        'GBP': 0.75,
        'JPY': 157.48
    };

    transform(value:number, targetCurrency: string = 'USD'): string {
        if (value == null || isNaN(value)){
            return 'N/A';
        }

        const rate = this.exchangeRates[targetCurrency] || 1;
        const convertedValue = value * rate;

        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: targetCurrency,
            maximumFractionDigits:0
        }).format(convertedValue);
    }
}