@extends('app')
	<?php 
	 $page = 'dev';	
	?> 
@section('content')
	<!-- header -->
	<script>
		@if(isset($imageArray))
			var imagearray = [];
			@foreach($imageArray as $key => $item) 
				imagearray.push('{{$item}}');
			@endforeach
		@endif
	</script>
	
	<link rel="stylesheet" href="/css/projects/pathfinder.css">
	<!--end header -->
	
	<!-- main content -->
	<div class="mainPage">	
		
		<h4 class="mainPageTitle">
			<b id="titleBold">This is currently under development as of 04-May-2016. Watch this space!</b>
		</h4>
		
		<div class="gamePageContent">
			<div class="errorMessageDefault">
				
				@include('eftersom.projects.pathfind.subviews.errorMsgs')
				
			</div>
			
			<div style="margin-top:60px;">
				
				@include('eftersom.projects.pathfind.subviews.canvas')
				<div class="rightPanelContent">
						@include('eftersom.projects.pathfind.subviews.mapUpload')
				</div>
				
			</div>
			
		</div>
		
	</div>
	<!-- end main content -->
	
	<!-- Load classes and scripts -->
		
		<script src="/resources/views/eftersom/projects/pathfind/js/pathfinder/CGrid.js"></script>
		<script src="/resources/views/eftersom/projects/pathfind/js/pathfinder/CNode.js"></script>
		<script src="/resources/views/eftersom/projects/pathfind/js/pathfinder/CPlayerNodes.js"></script>
		<script src="/resources/views/eftersom/projects/pathfind/js/pathfinder/CFrontier.js"></script>
		<script src="/resources/views/eftersom/projects/pathfind/js/pathfinder/main.js"></script>
	
	<!-- End load classes and scripts -->
@stop