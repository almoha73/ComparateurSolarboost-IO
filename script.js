document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS DU DOM ---
    // Inputs elements
    const compPwr = document.getElementById('compteur-pwr');
    const compOptionTarifaire = document.getElementById('option-tarifaire');
    const compHouseCons = document.getElementById('house-cons');
    const compSolarPwr = document.getElementById('solar-pwr');
    const compSolarPwrInput = document.getElementById('solar-pwr-input');
    const compBatterySize = document.getElementById('comp-battery-size');
    const compBatteryInput = document.getElementById('comp-battery-input');
    const compAutoconsRate = document.getElementById('autocons-rate');
    const compAutoconsRateInput = document.getElementById('autocons-rate-input');
    const compVeMileage = document.getElementById('ve-mileage');
    const compVeEfficiency = document.getElementById('ve-efficiency');
    const compVeProfile = document.getElementById('ve-profile');
    const compSolarWelcome = document.getElementById('solar-welcome-bonus');
    const compSbGridVersion = document.getElementById('sb-grid-version');
    const compIoGridVersion = document.getElementById('io-grid-version');
    const compStandardBuyback = document.getElementById('standard-buyback-rate');

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
    const sbCostLabel = document.getElementById('sb-cost-label');
    const sbTooltipText = document.getElementById('sb-tooltip-text');
    const sbNetCostCard = document.getElementById('sb-net-cost-card');

    // Outputs Intelligent Octopus
    const ioNetAnnual = document.getElementById('io-net-annual');
    const ioNetMonthly = document.getElementById('io-net-monthly');
    const ioBillSub = document.getElementById('io-bill-sub');
    const ioBillHouse = document.getElementById('io-bill-house');
    const ioBillVe = document.getElementById('io-bill-ve');
    const ioGainBuyback = document.getElementById('io-gain-buyback');
    const ioBuybackTitle = document.getElementById('io-buyback-title');
    const ioCostLabel = document.getElementById('io-cost-label');
    const ioTooltipText = document.getElementById('io-tooltip-text');
    const ioNetCostCard = document.getElementById('io-net-cost-card');

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
        const sbGridVersionVal = compSbGridVersion ? compSbGridVersion.value : 'new';
        const ioGridVersionVal = compIoGridVersion.value;
        const houseConsVal = parseFloat(compHouseCons.value) || 0;
        const solarkWcVal = parseFloat(compSolarPwr.value);
        const batterykWhVal = parseFloat(compBatterySize.value);
        const autoconsRateVal = compAutoconsRate ? (parseFloat(compAutoconsRate.value) || 60) : 60;
        const veMileageVal = parseFloat(compVeMileage.value) || 0;
        const veEfficiencyVal = parseFloat(compVeEfficiency.value) || 0;
        const veProfileVal = compVeProfile ? parseFloat(compVeProfile.value) : 0.40;
        const welcomeBonusChecked = compSolarWelcome.checked;
        const standardBuybackVal = parseFloat(compStandardBuyback.value);

        // Synchro des sliders vers les inputs numériques (si non focalisés)
        if (document.activeElement !== compSolarPwrInput) {
            compSolarPwrInput.value = solarkWcVal.toFixed(1);
        }
        if (document.activeElement !== compBatteryInput) {
            compBatteryInput.value = batterykWhVal;
        }
        if (compAutoconsRateInput && document.activeElement !== compAutoconsRateInput) {
            compAutoconsRateInput.value = Math.round(autoconsRateVal);
        }

        // Constantes tarifaires
        const tariffIO = 0.08;     // Tarif net garanti Intelligent Octopus pour la recharge VE
        const sbBuybackRate = 0.04; // Tarif rachat surplus SolarBoost (4 cts/kWh)
        const isHPHC = (optionTarifaireVal === 'hphc');

        // --- GRILLE TARIFAIRE SOLARBOOST ---
        let sbRateBase = 0.1985;
        let sbRateHP = 0.2142;
        let sbRateHC = 0.1589;
        let sbMonthlySub = 19.88;

        if (sbGridVersionVal === 'new') {
            // NOUVELLE GRILLE SOLARBOOST (Août / Septembre 2026 - Grille Officielle)
            sbRateBase = (pwrKVA <= 6) ? 0.2001 : 0.1985;
            sbRateHP = 0.2142;
            sbRateHC = 0.1589;

            // Abonnements mensuels TTC identiques en Option Base et Option HP/HC
            if (pwrKVA === 3) sbMonthlySub = 12.13;
            else if (pwrKVA === 6) sbMonthlySub = 15.86;
            else if (pwrKVA === 9) sbMonthlySub = 19.88;
            else if (pwrKVA === 12) sbMonthlySub = 23.76;
            else sbMonthlySub = 19.88;
        } else {
            // ANCIENNE GRILLE SOLARBOOST (Mars 2026)
            sbRateBase = (pwrKVA <= 6) ? 0.1940 : 0.1925;
            sbRateHP = 0.2074;
            sbRateHC = 0.1588;

            if (pwrKVA === 3) {
                sbMonthlySub = isHPHC ? 12.05 : 12.03;
            } else if (pwrKVA === 6) {
                sbMonthlySub = 15.65;
            } else if (pwrKVA === 9) {
                sbMonthlySub = isHPHC ? 19.83 : 19.56;
            } else if (pwrKVA === 12) {
                sbMonthlySub = isHPHC ? 23.68 : 23.32;
            }
        }
        const sbAnnualSub = sbMonthlySub * 12;

        // --- GRILLE TARIFAIRE INTELLIGENT OCTOPUS (IO) ---
        let ioRateBase = 0.1953;
        let ioRateHP = 0.2106;
        let ioRateHC = 0.1565;
        let ioMonthlySub = 19.88;

        if (ioGridVersionVal === 'old') {
            // Ancienne Grille IO (Janvier 2026 et avant)
            ioRateBase = 0.1954;
            ioRateHP = 0.2080;
            ioRateHC = 0.1645;

            if (pwrKVA === 3) ioMonthlySub = isHPHC ? 11.36 : 11.25;
            else if (pwrKVA === 6) ioMonthlySub = isHPHC ? 15.05 : 14.78;
            else if (pwrKVA === 9) ioMonthlySub = isHPHC ? 19.19 : 18.49;
            else if (pwrKVA === 12) ioMonthlySub = isHPHC ? 23.01 : 22.21;
        } else if (ioGridVersionVal === 'fev26') {
            // Grille IO Février 2026
            ioRateBase = (pwrKVA <= 6) ? 0.1909 : 0.1895;
            ioRateHP = 0.2031;
            ioRateHC = 0.1555;

            if (pwrKVA === 3) ioMonthlySub = isHPHC ? 12.05 : 12.03;
            else if (pwrKVA === 6) ioMonthlySub = 15.65;
            else if (pwrKVA === 9) ioMonthlySub = isHPHC ? 19.83 : 19.56;
            else if (pwrKVA === 12) ioMonthlySub = isHPHC ? 23.68 : 23.32;
        } else {
            // NOUVELLE GRILLE IO (Août / Septembre 2026 - Grille Officielle)
            ioRateBase = (pwrKVA <= 6) ? 0.1968 : 0.1953;
            ioRateHP = 0.2106;
            ioRateHC = 0.1565;

            // Abonnements mensuels TTC identiques en Option Base et Option HP/HC
            if (pwrKVA === 3) ioMonthlySub = 12.13;
            else if (pwrKVA === 6) ioMonthlySub = 15.86;
            else if (pwrKVA === 9) ioMonthlySub = 19.88;
            else if (pwrKVA === 12) ioMonthlySub = 23.76;
            else ioMonthlySub = 19.88;
        }
        const ioAnnualSub = ioMonthlySub * 12;

        // --- CALCULS PHYSIQUES SOLAIRE ET CONSOMMATION ---
        // Production solaire totale (1 kWc = 1 000 kWh/an)
        const annualProduction = solarkWcVal * 1000;

        // Taux d'autoconsommation physique (ex: 60%)
        const autoConsRatio = autoconsRateVal / 100;

        // Énergie PV autoconsommée déductible de la facture
        const pvEnergyConsumed = annualProduction * autoConsRatio;

        // Surplus injecté sur le réseau et valorisé
        const pvSurplus = annualProduction * (1 - autoConsRatio);

        // Consommation annuelle du VE (kWh/an)
        const veConsVal = (veMileageVal * veEfficiencyVal) / 100;

        // Consommation totale du foyer
        const totalHouseholdCons = houseConsVal + veConsVal;

        // Import réseau global après déduction de l'énergie PV consommée
        const totalGridImport = Math.max(0, totalHouseholdCons - pvEnergyConsumed);

        // --- RÉPARTITION ÉNERGÉTIQUE ENTRE VE ET MAISON ---
        // Le profil VE détermine la part de recharge couverte par le solaire direct :
        // Pendulaire classique = 20%, Mix = 40%, Full domicile = 60%
        const veSolarTarget = veConsVal * veProfileVal;
        const veSolarKwh = Math.min(veSolarTarget, pvEnergyConsumed);
        const veGridImport = veConsVal - veSolarKwh;

        // Le solde d'énergie PV consommée est alloué aux besoins de la maison
        const houseSolarKwh = Math.min(houseConsVal, pvEnergyConsumed - veSolarKwh);
        const houseGridImport = Math.max(0, houseConsVal - houseSolarKwh);

        // --- CALCUL DES COÛTS : SOLAR BOOST ---
        // Coût Maison
        let sbHouseCost = 0;
        if (isHPHC) {
            // Répartition standard de la maison : 60% HP / 40% HC
            sbHouseCost = houseGridImport * (0.60 * sbRateHP + 0.40 * sbRateHC);
        } else {
            sbHouseCost = houseGridImport * sbRateBase;
        }

        // Coût Recharge VE
        let sbVeCost = 0;
        if (isHPHC) {
            // En HP/HC, la recharge réseau du VE s'effectue principalement en heures creuses (la nuit)
            let hcShare = 1.0;
            if (veProfileVal > 0.45) hcShare = 0.80; // Full domicile : 80% HC, 20% HP
            else if (veProfileVal > 0.25) hcShare = 0.90; // Mix : 90% HC, 10% HP
            sbVeCost = veGridImport * (hcShare * sbRateHC + (1 - hcShare) * sbRateHP);
        } else {
            sbVeCost = veGridImport * sbRateBase;
        }

        // Rachat du surplus Solar Boost (4 cts/kWh)
        const sbBuybackRevenue = pvSurplus * sbBuybackRate;

        // Bonus pilotage batterie quotidien (0,10 €/jour par kWh)
        const sbPilotageBonus = batterykWhVal * 0.10 * 365;

        // Bonus Bienvenue 1ère année offerte (OESF)
        let welcomeBonusAmount = 0;
        if (welcomeBonusChecked && batterykWhVal > 0) {
            if (batterykWhVal < 6) welcomeBonusAmount = 200;
            else if (batterykWhVal < 9) welcomeBonusAmount = 250;
            else welcomeBonusAmount = 350;
        }

        // Coûts Nets Solar Boost sur 3 ans
        const sbNetY1 = sbAnnualSub + sbHouseCost + sbVeCost - sbBuybackRevenue - sbPilotageBonus - welcomeBonusAmount;
        const sbNetY2 = sbAnnualSub + sbHouseCost + sbVeCost - sbBuybackRevenue - sbPilotageBonus;
        const sbNetY3 = sbNetY2;
        const sbTotal3Years = sbNetY1 + sbNetY2 + sbNetY3;
        const sbAverageNetAnnual = sbTotal3Years / 3;

        // --- CALCUL DES COÛTS : INTELLIGENT OCTOPUS (IO) ---
        // Dans IO, si le client a une batterie, l'autoconsommation de la maison est identique à SB (60%).
        // Si pas de batterie, l'autoconsommation chute à ~35%.
        const ioAutoConsRatio = (batterykWhVal > 0) ? autoConsRatio : 0.35;
        const ioPvEnergyConsumed = annualProduction * ioAutoConsRatio;
        const ioSurplus = annualProduction * (1 - ioAutoConsRatio);

        // Répartition VE et Maison sous IO
        const ioVeSolarKwh = Math.min(veConsVal * veProfileVal, ioPvEnergyConsumed);
        const ioVeGridImport = veConsVal - ioVeSolarKwh;
        const ioHouseSolarKwh = Math.min(houseConsVal, ioPvEnergyConsumed - ioVeSolarKwh);
        const ioHouseGridImport = Math.max(0, houseConsVal - ioHouseSolarKwh);

        // Coût Maison IO
        let ioHouseCost = 0;
        if (isHPHC) {
            ioHouseCost = ioHouseGridImport * (0.60 * ioRateHP + 0.40 * ioRateHC);
        } else {
            ioHouseCost = ioHouseGridImport * ioRateBase;
        }

        // Coût Recharge VE IO : 0,08 €/kWh net garanti sur tout l'import réseau
        const ioVeCost = ioVeGridImport * tariffIO;

        // Rachat du surplus IO au tarif EDF OA sélectionné
        const ioBuybackRevenue = ioSurplus * standardBuybackVal;

        // Coûts Nets IO sur 3 ans (identique chaque année)
        const ioNetY1 = ioAnnualSub + ioHouseCost + ioVeCost - ioBuybackRevenue;
        const ioNetY2 = ioNetY1;
        const ioNetY3 = ioNetY1;
        const ioTotal3Years = ioNetY1 + ioNetY2 + ioNetY3;
        const ioAverageNetAnnual = ioTotal3Years / 3;

        // --- AFFICHAGE DES RÉSULTATS SOLAR BOOST ---
        const totalSbGains = sbBuybackRevenue + sbPilotageBonus + (welcomeBonusAmount / 3);

        if (sbAverageNetAnnual < 0) {
            const netCreditAnnual = Math.abs(Math.round(sbAverageNetAnnual));
            const netCreditMonthly = Math.abs(sbAverageNetAnnual / 12).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            if (sbCostLabel) sbCostLabel.textContent = "🟢 Solde Créditeur Net (3 ans)";
            sbNetAnnual.textContent = "+ " + netCreditAnnual.toLocaleString('fr-FR') + " € / an";
            sbNetAnnual.style.color = "var(--success)";
            sbNetMonthly.textContent = "soit + " + netCreditMonthly + " € / mois reversés par Octopus";
            if (sbNetCostCard) sbNetCostCard.classList.add('is-credit');

            if (sbTooltipText) {
                sbTooltipText.innerHTML = `👉 <strong>Quand le foyer a une bonne production solaire (${solarkWcVal} kWc) et une batterie de ${batterykWhVal} kWh</strong>, les gains (<strong>-${Math.round(totalSbGains)} €/an</strong> de bonus) sont supérieurs à sa facture d'électricité !<br><br>Le foyer devient donc <strong>créditeur net de ${netCreditAnnual} € par an</strong> (Octopus vous reverse de l'argent).`;
            }
        } else {
            if (sbCostLabel) sbCostLabel.textContent = "Coût Net Moyen (3 ans)";
            sbNetAnnual.textContent = Math.round(sbAverageNetAnnual).toLocaleString('fr-FR') + ' €';
            sbNetAnnual.style.color = "#fff";
            sbNetMonthly.textContent = 'soit ' + (sbAverageNetAnnual / 12).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' € / mois';
            if (sbNetCostCard) sbNetCostCard.classList.remove('is-credit');

            if (sbTooltipText) {
                sbTooltipText.innerHTML = `Le <strong>coût net moyen</strong> prend en compte vos dépenses d'électricité (abonnement + import réseau) diminuées de vos gains (<strong>-${Math.round(totalSbGains)} €/an</strong> de bonus batterie, rachat surplus et cadeau 1ère année).`;
            }
        }

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

        if (ioTooltipText) {
            ioTooltipText.innerHTML = `Le <strong>coût net Intelligent Octopus</strong> prend en compte votre abonnement, la maison et la recharge de votre VE garantie à <strong>0,08 €/kWh</strong>, déduction faite de la revente du surplus solaire au tarif EDF OA choisi.`;
        }

        // Libellé de rachat EDF OA dynamique
        let rateLabel = (standardBuybackVal * 100).toFixed(1) + ' cts';
        if (standardBuybackVal === 0.011) rateLabel = '1.1 cts (EDF OA actuel)';
        else if (standardBuybackVal === 0.04) rateLabel = '4.0 cts (EDF OA 2025)';
        else if (standardBuybackVal === 0.13) rateLabel = '13.0 cts (EDF OA < fév. 2025)';
        ioBuybackTitle.textContent = 'Rachat Surplus (' + rateLabel + ') :';

        // Profil VE texte pour les infobulles
        let profName = 'Mix 40% solaire';
        if (veProfileVal <= 0.25) profName = 'Pendulaire 20% solaire';
        else if (veProfileVal > 0.45) profName = 'Full domicile 60% solaire';

        // Mise à jour dynamique des libellés de cartes
        if (isHPHC) {
            const sbAvgHouseRate = 0.60 * sbRateHP + 0.40 * sbRateHC;
            sbLabelHouse.innerHTML = `Maison (${Math.round(houseGridImport)} kWh réseau à <strong>${sbAvgHouseRate.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
            sbLabelVe.innerHTML = `Recharge VE (${Math.round(veGridImport)} kWh réseau en HC : <strong>${sbRateHC.toFixed(4).replace('.', ',')} €/kWh</strong>)`;

            const ioAvgHouseRate = 0.60 * ioRateHP + 0.40 * ioRateHC;
            ioLabelHouse.innerHTML = `Maison (${Math.round(ioHouseGridImport)} kWh réseau à <strong>${ioAvgHouseRate.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
        } else {
            sbLabelHouse.innerHTML = `Maison (${Math.round(houseGridImport)} kWh réseau à <strong>${sbRateBase.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
            sbLabelVe.innerHTML = `Recharge VE (${Math.round(veGridImport)} kWh réseau à <strong>${sbRateBase.toFixed(4).replace('.', ',')} €/kWh</strong>)`;

            ioLabelHouse.innerHTML = `Maison (${Math.round(ioHouseGridImport)} kWh réseau à <strong>${ioRateBase.toFixed(4).replace('.', ',')} €/kWh</strong>)`;
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

        // --- CARTE DE CONCLUSION & RECOMMANDATION DYNAMIQUE ---
        conclusionContainer.className = 'conclusion-box';
        if (sbAverageNetAnnual < ioAverageNetAnnual) {
            const saving = ioAverageNetAnnual - sbAverageNetAnnual;
            conclusionEmoji.textContent = '🟢';
            conclusionTitle.textContent = 'L\'offre Solar Boost est plus économique !';
            conclusionDesc.innerHTML = `Vous économisez en moyenne <strong>${Math.round(saving)} € par an</strong> (soit <strong>${Math.round(saving * 3)} € sur 3 ans</strong>) avec Solar Boost.<br>
                                       <em>Pourquoi ?</em> Grâce au <strong>Bonus Pilotage quotidien de la batterie</strong> (qui vous rapporte ${Math.round(sbPilotageBonus)} €/an) et au <strong>rachat du surplus à 4 cts/kWh</strong>, combinés à votre profil de recharge VE (${profName}).`;
            conclusionContainer.classList.add('winner-sb');
        } else if (ioAverageNetAnnual < sbAverageNetAnnual) {
            const saving = sbAverageNetAnnual - ioAverageNetAnnual;
            conclusionEmoji.textContent = '⚡';
            conclusionTitle.textContent = 'L\'offre Intelligent Octopus est plus économique !';
            conclusionDesc.innerHTML = `Vous économisez en moyenne <strong>${Math.round(saving)} € par an</strong> (soit <strong>${Math.round(saving * 3)} € sur 3 ans</strong>) avec Intelligent Octopus.<br>
                                       <em>Pourquoi ?</em> Le <strong>tarif de recharge VE garanti à 0,08 €/kWh</strong> surpasse les gains du pilotage batterie, notamment avec un kilométrage élevé et une recharge majoritairement sur le réseau.`;
            conclusionContainer.classList.add('winner-io');
        } else {
            conclusionEmoji.textContent = '⚖️';
            conclusionTitle.textContent = 'Les deux offres sont financièrement équivalentes !';
            conclusionDesc.textContent = 'Ajustez votre profil de recharge VE ou votre capacité de batterie pour identifier quelle offre maximise vos économies.';
            conclusionContainer.classList.add('draw');
        }
    }

    // Association des écouteurs d'événements
    const inputsList = [
        compPwr,
        compOptionTarifaire,
        compSbGridVersion,
        compIoGridVersion,
        compHouseCons, 
        compSolarPwr, 
        compBatterySize, 
        compAutoconsRate,
        compVeMileage, 
        compVeEfficiency, 
        compVeProfile, 
        compSolarWelcome, 
        compStandardBuyback
    ];

    inputsList.forEach(input => {
        if (input) {
            const eventType = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'input';
            input.addEventListener(eventType, updateComparison);
        }
    });

    // Synchronisation du champ de saisie numérique vers le slider pour la puissance solaire
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

    // Synchronisation du champ de saisie numérique vers le slider pour la batterie
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

    // Synchronisation du champ de saisie numérique vers le slider pour l'autoconsommation
    if (compAutoconsRateInput && compAutoconsRate) {
        compAutoconsRateInput.addEventListener('input', () => {
            let val = parseFloat(compAutoconsRateInput.value);
            if (!isNaN(val) && val >= 20 && val <= 95) {
                compAutoconsRate.value = val;
                updateComparison();
            }
        });
        compAutoconsRateInput.addEventListener('change', () => {
            let val = parseFloat(compAutoconsRateInput.value);
            if (isNaN(val) || val < 20) val = 20;
            if (val > 95) val = 95;
            compAutoconsRateInput.value = val;
            compAutoconsRate.value = val;
            updateComparison();
        });
    }

    // Lancer la première mise à jour à l'initialisation
    updateComparison();
});
