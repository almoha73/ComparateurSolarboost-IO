document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS DU DOM ---
    // Inputs elements
    const compPwr = document.getElementById('compteur-pwr');
    const compHouseCons = document.getElementById('house-cons');
    const compSolarPwr = document.getElementById('solar-pwr');
    const compSolarPwrInput = document.getElementById('solar-pwr-input');
    const compBatterySize = document.getElementById('comp-battery-size');
    const compBatteryInput = document.getElementById('comp-battery-input');
    const compVeMileage = document.getElementById('ve-mileage');
    const compVeEfficiency = document.getElementById('ve-efficiency');
    const compVeSunHours = document.getElementById('ve-sun-hours');
    const compSolarWelcome = document.getElementById('solar-welcome-bonus');
    const compStandardBuyback = document.getElementById('standard-buyback-rate');
    const compOptionTarifaire = document.getElementById('option-tarifaire');
    const compIoGridVersion = document.getElementById('io-grid-version');


    // Outputs Solar Boost
    const sbNetAnnual = document.getElementById('sb-net-annual');
    const sbNetMonthly = document.getElementById('sb-net-monthly');
    const sbBillSub = document.getElementById('sb-bill-sub');
    const sbBillHouse = document.getElementById('sb-bill-house');
    const sbBillVe = document.getElementById('sb-bill-ve');
    const sbGainPilot = document.getElementById('sb-gain-pilot');
    const sbGainBuyback = document.getElementById('sb-gain-buyback');
    const sbWelcomeLi = document.getElementById('sb-welcome-li');
    const sbWelcomeDisplay = document.getElementById('sb-welcome-display');

    // Outputs Intelligent Octopus
    const ioNetAnnual = document.getElementById('io-net-annual');
    const ioNetMonthly = document.getElementById('io-net-monthly');
    const ioBillSub = document.getElementById('io-bill-sub');
    const ioBillHouse = document.getElementById('io-bill-house');
    const ioBillVe = document.getElementById('io-bill-ve');
    const ioGainBuyback = document.getElementById('io-gain-buyback');
    const ioBuybackTitle = document.getElementById('io-buyback-title');

    // Labels de tarifs dynamiques
    const sbLabelHouse = document.getElementById('sb-label-house');
    const sbLabelVe = document.getElementById('sb-label-ve');
    const ioLabelHouse = document.getElementById('io-label-house');

    // Conclusion & 3-Year Table
    const conclusionEmoji = document.getElementById('conclusion-emoji');
    const conclusionTitle = document.getElementById('conclusion-title');
    const conclusionDesc = document.getElementById('conclusion-desc');
    const conclusionContainer = document.getElementById('comparison-conclusion');

    const sbTableY1 = document.getElementById('sb-table-y1');
    const sbTableY2 = document.getElementById('sb-table-y2');
    const sbTableY3 = document.getElementById('sb-table-y3');
    const sbTableTotal = document.getElementById('sb-table-total');

    const ioTableY1 = document.getElementById('io-table-y1');
    const ioTableY2 = document.getElementById('io-table-y2');
    const ioTableY3 = document.getElementById('io-table-y3');
    const ioTableTotal = document.getElementById('io-table-total');

    const diffTableY1 = document.getElementById('diff-table-y1');
    const diffTableY2 = document.getElementById('diff-table-y2');
    const diffTableY3 = document.getElementById('diff-table-y3');
    const diffTableTotal = document.getElementById('diff-table-total');

    function updateComparison() {
        if (!compHouseCons) return;

        // Récupération des valeurs d'entrée
        const pwrKVA = parseInt(compPwr.value);
        const optionTarifaireVal = compOptionTarifaire.value;
        const ioGridVersionVal = compIoGridVersion.value;
        const houseConsVal = parseFloat(compHouseCons.value) || 0;
        const solarkWcVal = parseFloat(compSolarPwr.value);
        const batterykWhVal = parseFloat(compBatterySize.value);
        const veMileageVal = parseFloat(compVeMileage.value) || 0;
        const veEfficiencyVal = parseFloat(compVeEfficiency.value) || 0;
        const veSunHoursVal = compVeSunHours.checked;
        const welcomeBonusChecked = compSolarWelcome.checked;
        const standardBuybackVal = parseFloat(compStandardBuyback.value);

        // Synchro de la valeur du slider vers le champ de saisie (si ce n'est pas le champ de saisie qui a le focus)
        if (document.activeElement !== compSolarPwrInput) {
            compSolarPwrInput.value = solarkWcVal.toFixed(1);
        }
        if (document.activeElement !== compBatteryInput) {
            compBatteryInput.value = batterykWhVal;
        }

        // Constantes tarifaires
        const tariffIO = 0.08;     
        const sbBuybackRate = 0.04; 

        // Prix de l'électricité selon l'option tarifaire choisie (Séparé par Offre)
        const isHPHC = (optionTarifaireVal === 'hphc');
        
        // Grille Solar Boost (Applicable au 01/03/2026)
        // Pour les puissances <= 6 kVA, le tarif de base est de 0.1940 €, sinon 0.1925 €
        const sbRateBase = (pwrKVA <= 6) ? 0.1940 : 0.1925;
        const sbRateHP = 0.2074;
        const sbRateHC = 0.1588;

        // Grille Intelligent Octopus (IO) - Choix dynamique selon la version sélectionnée
        let ioRateBase = 0.1895;
        let ioRateHP = 0.2031;
        let ioRateHC = 0.1555;

        if (ioGridVersionVal === 'old') {
            // Ancienne Grille IO (Janvier 2026)
            ioRateBase = 0.1954;
            ioRateHP = 0.2080;
            ioRateHC = 0.1645;
        } else {
            // Nouvelle Grille IO (Février 2026)
            // Pour les puissances <= 6 kVA, le tarif de base est de 0.1909 €, sinon 0.1895 €
            ioRateBase = (pwrKVA <= 6) ? 0.1909 : 0.1895;
            ioRateHP = 0.2031;
            ioRateHC = 0.1555;
        }

        // Calcul des abonnements annuels pour Solar Boost (Grille Mars 2026)
        let sbMonthlySub = 15.65;
        if (pwrKVA === 3) {
            sbMonthlySub = isHPHC ? 12.05 : 12.03;
        } else if (pwrKVA === 9) {
            sbMonthlySub = isHPHC ? 19.83 : 19.56;
        } else if (pwrKVA === 12) {
            sbMonthlySub = isHPHC ? 23.68 : 23.32;
        }
        const sbAnnualSub = sbMonthlySub * 12;

        // Calcul des abonnements annuels pour Intelligent Octopus (Choix selon la grille)
        let ioMonthlySub = 15.65;
        if (ioGridVersionVal === 'old') {
            // Ancienne Grille Janvier 2026
            if (pwrKVA === 3) {
                ioMonthlySub = isHPHC ? 11.36 : 11.25;
            } else if (pwrKVA === 6) {
                ioMonthlySub = isHPHC ? 15.05 : 14.78;
            } else if (pwrKVA === 9) {
                ioMonthlySub = isHPHC ? 19.19 : 18.49;
            } else if (pwrKVA === 12) {
                ioMonthlySub = isHPHC ? 23.01 : 22.21;
            }
        } else {
            // Nouvelle Grille Février 2026
            if (pwrKVA === 3) {
                ioMonthlySub = isHPHC ? 12.05 : 12.03;
            } else if (pwrKVA === 9) {
                ioMonthlySub = isHPHC ? 19.83 : 19.56;
            } else if (pwrKVA === 12) {
                ioMonthlySub = isHPHC ? 23.68 : 23.32;
            }
        }
        const ioAnnualSub = ioMonthlySub * 12;

        // Productions solaires (1 kWc = 1000 kWh/an)
        const annualProduction = solarkWcVal * 1000;

        // Consommation annuelle du VE (kWh/an)
        const veConsVal = (veMileageVal * veEfficiencyVal) / 100;

        // --- OFFRE SOLAR BOOST (SB) ---
        // Autoconsommation de 70% pour la maison grâce à la batterie. 30% d'import réseau.
        const sbHouseImport = houseConsVal * 0.30;
        let sbHouseCost = 0;
        if (isHPHC) {
            // En HP/HC, on considère la répartition standard : 60% HP / 40% HC pour l'import réseau
            sbHouseCost = sbHouseImport * (0.60 * sbRateHP + 0.40 * sbRateHC);
        } else {
            sbHouseCost = sbHouseImport * sbRateBase;
        }

        // Coût recharge VE sous Solar Boost
        let sbVeCost = 0;
        if (veSunHoursVal) {
            // Branché le jour : 70% couvert par le solaire direct/batterie (gratuit), 30% tiré sur le réseau.
            // Le jour correspond aux Heures Pleines (HP) en option HP/HC.
            const rateVeh = isHPHC ? sbRateHP : sbRateBase;
            sbVeCost = veConsVal * 0.30 * rateVeh;
        } else {
            // Branché la nuit : 100% tiré sur le réseau au tarif standard.
            // La nuit correspond aux Heures Creuses (HC) en option HP/HC.
            const rateVeh = isHPHC ? sbRateHC : sbRateBase;
            sbVeCost = veConsVal * rateVeh;
        }

        // Rachat du surplus (30% de la production solaire) au tarif Solar Boost (4 cts)
        const sbSurplus = annualProduction * 0.30;
        const sbBuybackRevenue = sbSurplus * sbBuybackRate;

        // Bonus de pilotage quotidien de la batterie (0.10€ par jour par kWh de batterie)
        const sbPilotageBonus = batterykWhVal * 0.10 * 365;

        // Bonus Bienvenue 1ère année offerte (grille officielle basée sur la batterie)
        let welcomeBonusAmount = 0;
        if (welcomeBonusChecked && batterykWhVal > 0) {
            if (batterykWhVal < 6) {
                welcomeBonusAmount = 200;
            } else if (batterykWhVal < 9) {
                welcomeBonusAmount = 250;
            } else {
                welcomeBonusAmount = 350;
            }
        }

        // Coûts Nets SB année par année
        const sbNetY1 = sbAnnualSub + sbHouseCost + sbVeCost - sbBuybackRevenue - sbPilotageBonus - welcomeBonusAmount;
        const sbNetY2 = sbAnnualSub + sbHouseCost + sbVeCost - sbBuybackRevenue - sbPilotageBonus;
        const sbNetY3 = sbNetY2;
        const sbTotal3Years = sbNetY1 + sbNetY2 + sbNetY3;
        const sbAverageNetAnnual = sbTotal3Years / 3;

        // --- OFFRE INTELLIGENT OCTOPUS (IO) ---
        // Autoconsommation de la maison :
        // Si le client a une batterie (sélectionnée sur le slider) : 70% d'autoconsommation (import 30%)
        // Sinon : 35% d'autoconsommation standard (import 65%)
        const ioSelfConsRate = (batterykWhVal > 0) ? 0.70 : 0.35;
        const ioHouseImport = houseConsVal * (1 - ioSelfConsRate);
        let ioHouseCost = 0;
        if (isHPHC) {
            // En HP/HC, on applique la même répartition standard 60% HP / 40% HC pour la maison
            ioHouseCost = ioHouseImport * (0.60 * ioRateHP + 0.40 * ioRateHC);
        } else {
            ioHouseCost = ioHouseImport * ioRateBase;
        }

        // Recharge VE avec IO : coût net garanti à 8 cts grâce à la recharge pilotée
        const ioVeCost = veConsVal * tariffIO;

        // Rachat surplus avec IO au tarif standard (EDF OA) choisi
        const ioSurplus = annualProduction * (1 - ioSelfConsRate);
        const ioBuybackRevenue = ioSurplus * standardBuybackVal;

        // Coûts Nets IO année par année (identique d'une année à l'autre)
        const ioNetY1 = ioAnnualSub + ioHouseCost + ioVeCost - ioBuybackRevenue;
        const ioNetY2 = ioNetY1;
        const ioNetY3 = ioNetY1;
        const ioTotal3Years = ioNetY1 + ioNetY2 + ioNetY3;
        const ioAverageNetAnnual = ioTotal3Years / 3;

        // --- AFFICHAGE DES RÉSULTATS SOLAR BOOST ---
        sbNetAnnual.textContent = Math.round(sbAverageNetAnnual).toLocaleString('fr-FR') + ' €';
        sbNetMonthly.textContent = 'soit ' + (sbAverageNetAnnual / 12).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' € / mois';
        sbBillSub.textContent = Math.round(sbAnnualSub).toLocaleString('fr-FR') + ' €/an';
        sbBillHouse.textContent = Math.round(sbHouseCost).toLocaleString('fr-FR') + ' €/an';
        sbBillVe.textContent = Math.round(sbVeCost).toLocaleString('fr-FR') + ' €/an';
        sbGainPilot.textContent = '-' + Math.round(sbPilotageBonus).toLocaleString('fr-FR') + ' €/an';
        sbGainBuyback.textContent = '-' + Math.round(sbBuybackRevenue).toLocaleString('fr-FR') + ' €/an';
        
        if (welcomeBonusAmount > 0) {
            sbWelcomeLi.style.display = 'flex';
            sbWelcomeDisplay.textContent = '-' + Math.round(welcomeBonusAmount / 3).toLocaleString('fr-FR') + ' €/an';
        } else {
            sbWelcomeLi.style.display = 'none';
        }

        // --- AFFICHAGE DES RÉSULTATS INTELLIGENT OCTOPUS ---
        ioNetAnnual.textContent = Math.round(ioAverageNetAnnual).toLocaleString('fr-FR') + ' €';
        ioNetMonthly.textContent = 'soit ' + (ioAverageNetAnnual / 12).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' € / mois';
        ioBillSub.textContent = Math.round(ioAnnualSub).toLocaleString('fr-FR') + ' €/an';
        ioBillHouse.textContent = Math.round(ioHouseCost).toLocaleString('fr-FR') + ' €/an';
        ioBillVe.textContent = Math.round(ioVeCost).toLocaleString('fr-FR') + ' €/an';
        ioGainBuyback.textContent = '-' + Math.round(ioBuybackRevenue).toLocaleString('fr-FR') + ' €/an';

        let rateLabel = (standardBuybackVal * 100).toFixed(1) + ' cts';
        if (standardBuybackVal === 0.011) rateLabel = '1.1 cts (nouveau)';
        else if (standardBuybackVal === 0.04) rateLabel = '4.0 cts (ancien)';
        else if (standardBuybackVal === 0.13) rateLabel = '13.0 cts (ancien)';
        ioBuybackTitle.textContent = 'Rachat Surplus (' + rateLabel + ') :';

        // Mise à jour dynamique des libellés de tarifs appliqués
        if (isHPHC) {
            const sbAvgRate = 0.60 * sbRateHP + 0.40 * sbRateHC;
            sbLabelHouse.innerHTML = `Maison (30% réseau à 60% HP / 40% HC : <strong>${sbAvgRate.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
            if (veSunHoursVal) {
                sbLabelVe.innerHTML = `Recharge VE (30% réseau en HP à <strong>${sbRateHP.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
            } else {
                sbLabelVe.innerHTML = `Recharge VE (100% réseau en HC à <strong>${sbRateHC.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
            }

            const ioAvgRate = 0.60 * ioRateHP + 0.40 * ioRateHC;
            ioLabelHouse.innerHTML = `Maison (${Math.round((1 - ioSelfConsRate) * 100)}% réseau à 60% HP / 40% HC : <strong>${ioAvgRate.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
        } else {
            sbLabelHouse.innerHTML = `Maison (30% réseau à <strong>${sbRateBase.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
            if (veSunHoursVal) {
                sbLabelVe.innerHTML = `Recharge VE (30% réseau à <strong>${sbRateBase.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
            } else {
                sbLabelVe.innerHTML = `Recharge VE (100% réseau à <strong>${sbRateBase.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
            }

            ioLabelHouse.innerHTML = `Maison (${Math.round((1 - ioSelfConsRate) * 100)}% réseau à <strong>${ioRateBase.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
        }

        // --- COMPARAISON TABLEAU SUR 3 ANS ---
        sbTableY1.textContent = Math.round(sbNetY1).toLocaleString('fr-FR') + ' €';
        sbTableY2.textContent = Math.round(sbNetY2).toLocaleString('fr-FR') + ' €';
        sbTableY3.textContent = Math.round(sbNetY3).toLocaleString('fr-FR') + ' €';
        sbTableTotal.textContent = Math.round(sbTotal3Years).toLocaleString('fr-FR') + ' €';

        ioTableY1.textContent = Math.round(ioNetY1).toLocaleString('fr-FR') + ' €';
        ioTableY2.textContent = Math.round(ioNetY2).toLocaleString('fr-FR') + ' €';
        ioTableY3.textContent = Math.round(ioNetY3).toLocaleString('fr-FR') + ' €';
        ioTableTotal.textContent = Math.round(ioTotal3Years).toLocaleString('fr-FR') + ' €';

        const diffY1 = ioNetY1 - sbNetY1;
        const diffY2 = ioNetY2 - sbNetY2;
        const diffY3 = ioNetY3 - sbNetY3;
        const diffTotal = ioTotal3Years - sbTotal3Years;

        function formatDiffShort(val) {
            if (val > 0) return '+' + Math.round(val).toLocaleString('fr-FR') + ' €';
            if (val < 0) return '-' + Math.round(Math.abs(val)).toLocaleString('fr-FR') + ' €';
            return '0 €';
        }

        diffTableY1.textContent = formatDiffShort(diffY1);
        diffTableY2.textContent = formatDiffShort(diffY2);
        diffTableY3.textContent = formatDiffShort(diffY3);

        if (diffTotal > 0) {
            diffTableTotal.textContent = '+' + Math.round(diffTotal).toLocaleString('fr-FR') + ' € d\'économie';
            diffTableTotal.style.color = 'var(--success)';
        } else if (diffTotal < 0) {
            diffTableTotal.textContent = '-' + Math.round(Math.abs(diffTotal)).toLocaleString('fr-FR') + ' € de surcoût';
            diffTableTotal.style.color = '#ef4444';
        } else {
            diffTableTotal.textContent = 'Équivalent';
            diffTableTotal.style.color = '#fff';
        }

        [diffTableY1, diffTableY2, diffTableY3].forEach((cell, idx) => {
            const val = [diffY1, diffY2, diffY3][idx];
            if (val > 0) {
                cell.style.color = 'var(--success)';
            } else if (val < 0) {
                cell.style.color = '#ef4444';
            } else {
                cell.style.color = '#fff';
            }
        });

        // --- CARTE DE CONCLUSION & RECOMMENDATION DYNAMIQUE ---
        conclusionContainer.className = 'conclusion-box'; // reset classes
        if (sbAverageNetAnnual < ioAverageNetAnnual) {
            const saving = ioAverageNetAnnual - sbAverageNetAnnual;
            conclusionEmoji.textContent = '🟢';
            conclusionTitle.textContent = 'L\'offre Solar Boost est plus économique !';
            conclusionDesc.innerHTML = `Vous économisez en moyenne <strong>${Math.round(saving)} € par an</strong> (soit <strong>${Math.round(saving * 3)} € sur 3 ans</strong>) avec Solar Boost.<br>
                                       <em>Pourquoi ?</em> Grâce au <strong>Bonus Pilotage quotidien de la batterie</strong> (qui vous rapporte ${Math.round(sbPilotageBonus)} €/an) et au <strong>tarif de rachat surplus fixé à 4 cts/kWh</strong> (contre ${rateLabel} pour EDF OA).`;
            conclusionContainer.classList.add('winner-sb');
        } else if (ioAverageNetAnnual < sbAverageNetAnnual) {
            const saving = sbAverageNetAnnual - ioAverageNetAnnual;
            conclusionEmoji.textContent = '⚡';
            conclusionTitle.textContent = 'L\'offre Intelligent Octopus est plus économique !';
            conclusionDesc.innerHTML = `Vous économisez en moyenne <strong>${Math.round(saving)} € par an</strong> (soit <strong>${Math.round(saving * 3)} € sur 3 ans</strong>) avec Intelligent Octopus.<br>
                                       <em>Pourquoi ?</em> Le <strong>tarif de recharge VE très avantageux de 0,08 €/kWh</strong> surpasse les gains du pilotage batterie, notamment en raison de votre kilométrage important et de l'absence de charge en journée.`;
            conclusionContainer.classList.add('winner-io');
        } else {
            conclusionEmoji.textContent = '⚖️';
            conclusionTitle.textContent = 'Les deux offres sont financièrement équivalentes !';
            conclusionDesc.textContent = 'Ajustez votre profil d\'utilisation (par exemple en cochant le branchement en journée ou en modifiant les km du véhicule) pour voir quelle offre se détache.';
            conclusionContainer.classList.add('draw');
        }
    }

    // Association des écouteurs d'événements
    const inputsList = [
        compPwr,
        compOptionTarifaire,
        compIoGridVersion,
        compHouseCons, 
        compSolarPwr, 
        compBatterySize, 
        compVeMileage, 
        compVeEfficiency, 
        compVeSunHours, 
        compSolarWelcome, 
        compStandardBuyback
    ];

    inputsList.forEach(input => {
        if (input) {
            const eventType = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'input';
            input.addEventListener(eventType, updateComparison);
        }
    });

    // Synchroniser le champ de saisie numérique vers le slider pour la puissance solaire
    compSolarPwrInput.addEventListener('input', () => {
        let val = parseFloat(compSolarPwrInput.value);
        if (!isNaN(val) && val >= 3 && val <= 12) {
            compSolarPwr.value = val;
            updateComparison();
        }
    });
    compSolarPwrInput.addEventListener('change', () => {
        let val = parseFloat(compSolarPwrInput.value);
        if (isNaN(val) || val < 3) val = 3;
        if (val > 12) val = 12;
        compSolarPwrInput.value = val;
        compSolarPwr.value = val;
        updateComparison();
    });

    // Synchroniser le champ de saisie numérique vers le slider pour la batterie
    compBatteryInput.addEventListener('input', () => {
        let val = parseFloat(compBatteryInput.value);
        if (!isNaN(val) && val >= 2 && val <= 15) {
            compBatterySize.value = val;
            updateComparison();
        }
    });
    compBatteryInput.addEventListener('change', () => {
        let val = parseFloat(compBatteryInput.value);
        if (isNaN(val) || val < 2) val = 2;
        if (val > 15) val = 15;
        compBatteryInput.value = val;
        compBatterySize.value = val;
        updateComparison();
    });

    // Lancer la première mise à jour à l'initialisation
    updateComparison();
});
