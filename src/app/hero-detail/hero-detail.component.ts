import { Component, Input, OnInit } from '@angular/core';;
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../hero'
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})

export class HeroDetailComponent implements OnInit {
  
  @Input() hero?: Hero;

  /*ActivatedRoute holds information about the route to this 
    instance of the HeroDetailComponent
  HeroService gets hero data from the remote server and this 
    component uses it to get the hero-to-display.
  location is an Angular service for interacting with the 
    browser. This service lets you navigate back to the previous 
    view.
  */
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {

    /*route.snapshot is a static image of the route 
        information shortly after the component was created.
      paramMap is a dictionary of route parameter values 
        extracted from the URL. The "id" key returns the id 
        of the hero to fetch.
    */
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if(this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }
}
