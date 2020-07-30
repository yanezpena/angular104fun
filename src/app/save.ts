<!-- <mat-toolbar>
	<button mat-icon-button (click)="drawer.toggle()">
		<mat-icon matTooltip="Open/Close Slide Menu">menu</mat-icon>
	</button>
	<span style="padding: 10px 0px 10px 10px;">{{
		'app_title' | translate
	}}</span>
	<mat-icon
		style="font-size: 26px; font-weight: bold; color: rgb(255, 175, 0);"
		>attach_money</mat-icon
	>
	<span class="example-spacer"></span>
	<button mat-icon-button matTooltip="Log In">
		<mat-icon>person</mat-icon>
	</button>
	<button mat-icon-button matTooltip="Sign In">
		<mat-icon>person_add</mat-icon>
	</button>
	<button mat-icon-button>
		<mat-icon matBadge="15" matBadgeColor="warn">notifications</mat-icon>
	</button>
	<button mat-icon-button>
		<mat-icon>favorite</mat-icon>
	</button>
	<button mat-icon-button>
		<mat-icon>share</mat-icon>
	</button>
	<app-select-language
		(languageChange)="onLanguageChange($event)"
	></app-select-language>
	<button mat-icon-button [matMenuTriggerFor]="menu">
		<mat-icon>more_vert</mat-icon>
	</button>
</mat-toolbar>

<mat-menu #menu="matMenu">
	<button mat-menu-item>
		<mat-icon>settings</mat-icon>
		<span>Settings</span>
	</button>
	<button mat-menu-item>
		<mat-icon>help</mat-icon>
		<span>Help</span>
	</button>
	<button mat-menu-item>
		<mat-icon>star</mat-icon>
		<span>About</span>
	</button>
</mat-menu>

<mat-drawer-container
	class="example-container"
	[hasBackdrop]="hasBackdrop.value"
>
	<mat-drawer #drawer [mode]="mode.value">
		<div>
			<div style="padding: 0px 0px; float: left;">
				<img
					style="width: 40px; height: 30px; padding: 5px 15px 40px;"
					src="../assets/img/logo.png"
				/>
			</div>

			<button
				mat-icon-button
				style="float: right;"
				(click)="drawer.toggle()"
			>
				<mat-icon style="transform: scale(0.8);">close</mat-icon>
			</button>
		</div>
		<div>
			<button mat-menu-item>
				<mat-icon>attach_money</mat-icon>
				<span style="padding: 20px 10px;">Expenses</span>
			</button>
			<button mat-menu-item>
				<mat-icon>show_chart</mat-icon>
				<span style="padding: 20px 10px;">Reports</span>
			</button>
			<button mat-menu-item>
				<mat-icon>search</mat-icon>
				<span style="padding: 20px 10px;">Search</span>
			</button>
			<button mat-menu-item>
				<mat-icon>person</mat-icon>
				<span style="padding: 20px 10px;">Users</span>
			</button>
		</div>
	</mat-drawer>

	<mat-drawer-content>
		<form
			class="autocomplete-form"
			[formGroup]="form"
			(ngSubmit)="submit()"
		>
			<mat-form-field style="width: 100%;">
				<mat-label>Sidenav mode</mat-label>
				<mat-select #mode value="side">
					<mat-option value="side">Side</mat-option>
					<mat-option value="over">Over</mat-option>
					<mat-option value="push">Push</mat-option>
				</mat-select>
			</mat-form-field>
			<mat-form-field style="width: 100%;">
				<mat-label>Has backdrop</mat-label>
				<mat-select #hasBackdrop>
					<mat-option>Unset</mat-option>
					<mat-option [value]="true">True</mat-option>
					<mat-option [value]="false">False</mat-option>
				</mat-select>
			</mat-form-field>
			<button mat-raised-button color="primary" (click)="drawer.toggle()">
				Toggle drawer
			</button>
			<app-input-autocomplete
				formControlName="pokemon"
				placeholder="Pokemon's name"
				[options]="pokemons$ | async"
			>
			</app-input-autocomplete>
			<app-input-autocomplete
				formControlName="swCharacter"
				placeholder="SW character's name"
				lengthToTriggerSearch="2"
				[options]="swCharacters$ | async"
			>
			</app-input-autocomplete>
			<mat-card>
				<mat-card-content>Icon with a badge</mat-card-content>
				<mat-icon matBadge="15" matBadgeColor="warn">home</mat-icon>
				<span class="cdk-visually-hidden">
					Example with a home icon with overlaid badge showing the
					number 15
				</span>
			</mat-card>
			<div class="example-section">
				<mat-checkbox class="example-margin" formControlName="checked"
					>Checked</mat-checkbox
				>
				<mat-checkbox
					class="example-margin"
					formControlName="indeterminate"
					>Indeterminate</mat-checkbox
				>
			</div>
			<div>
				<mat-radio-group
					class="example-radio-group"
					formControlName="radioButton"
				>
					<mat-radio-button
						class="example-radio-button"
						*ngFor="let season of seasons"
						[value]="season"
					>
						{{ season }}
					</mat-radio-button>
				</mat-radio-group>
			</div>
			<mat-form-field class="example-chip-list">
				<mat-chip-list #chipList aria-label="Fruit selection">
					<mat-chip
						*ngFor="let fruit of fruits"
						[selectable]="selectable"
						[removable]="removable"
						(removed)="remove(fruit)"
					>
						{{ fruit }}
						<mat-icon matChipRemove *ngIf="removable"
							>cancel</mat-icon
						>
					</mat-chip>
					<input
						placeholder="Select a fruit..."
						#fruitInput
						formControlName="fruitCtrl"
						[matAutocomplete]="auto"
						[matChipInputFor]="chipList"
						[matChipInputSeparatorKeyCodes]="separatorKeysCodes"
						(matChipInputTokenEnd)="add($event)"
						(blur)="blur($event)"
					/>
				</mat-chip-list>
				<mat-autocomplete
					#auto="matAutocomplete"
					(optionSelected)="selected($event)"
				>
					<mat-option
						*ngFor="let fruit of filteredFruits$ | async"
						[value]="fruit"
					>
						{{ fruit }}
					</mat-option>
				</mat-autocomplete>
			</mat-form-field>
			<div>
				<button mat-raised-button color="primary">Submit</button>
			</div>
		</form>
	</mat-drawer-content>
</mat-drawer-container>-->
