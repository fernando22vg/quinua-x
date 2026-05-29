# GammaGrow Scientific Models

## 1. Quinoa Experimental Model
* The quinoa model is based on experimental gamma irradiation data for quinoa cv. Pasankalla.
* The model uses doses 0, 150, 250 and 350 Gy.
* The model uses piecewise linear interpolation.
* The model estimates germination, growth, survival, biological damage and useful mutation probability.
* The useful mutation probability is a decision-support index, not a directly measured probability.
* The quinoa model must use Gy, not kGy.

## 2. Other Crops
* Other crops continue using the current empirical GammaGrow model.
* The empirical model is kept for demonstration and exploratory purposes.
* The experimental quinoa model must not be automatically generalized to other crops.

## 3. Units
* 1 kGy = 1000 Gy
* 150 Gy = 0.15 kGy
* 250 Gy = 0.25 kGy
* 350 Gy = 0.35 kGy

## 4. Limitations
* This model is an educational and decision-support simulation.
* It does not replace controlled laboratory or field trials.
* It is calibrated for Pasankalla-type quinoa.
* Other quinoa varieties may respond differently.
